<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Services\PageBlockSanitizer;
use App\Services\PageContentSanitizer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    public function __construct(
        private readonly PageContentSanitizer $sanitizer,
        private readonly PageBlockSanitizer $blockSanitizer,
    )
    {
    }

    public function index(Request $request)
    {
        $query = Page::query()->with(['creator', 'updater', 'menuItems'])->latest('updated_at');

        if ($search = $request->string('search')->trim()->toString()) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->string('status')->lower()->toString()) {
            match ($status) {
                'draft' => $query->where('status', 'draft'),
                'scheduled' => $query->where('status', 'published')->where('publish_at', '>', now()),
                'published' => $query->publishedAndDue(),
                default => null,
            };
        }

        if ($menuId = $request->integer('menu_id')) {
            $query->whereHas('menuItems', fn (Builder $q) => $q->whereKey($menuId));
        }

        $perPage = max(1, min($request->integer('per_page', 15), 100));

        return PageResource::collection($query->paginate($perPage)->withQueryString());
    }

    public function store(PageRequest $request): PageResource
    {
        $data = $request->safe()->except('cover_image');
        $data['body'] = $this->sanitizer->sanitize($data['body'] ?? '');
        $data['blocks'] = $this->blockSanitizer->sanitize(json_decode($data['blocks'] ?? '[]', true) ?: []);
        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('page-covers', 'public');
        }

        return DB::transaction(function () use ($data) {
            if (! empty($data['is_home'])) {
                Page::where('is_home', true)->update(['is_home' => false]);
            }

            return new PageResource(Page::create($data)->load(['creator', 'updater', 'menuItems']));
        });
    }

    public function show(Page $page): PageResource
    {
        return new PageResource($page->load(['creator', 'updater', 'menuItems']));
    }

    public function update(PageRequest $request, Page $page): PageResource
    {
        $data = $request->safe()->except('cover_image');
        if (array_key_exists('body', $data)) {
            $data['body'] = $this->sanitizer->sanitize($data['body']);
        }
        if (array_key_exists('blocks', $data)) {
            $data['blocks'] = $this->blockSanitizer->sanitize(json_decode($data['blocks'] ?? '[]', true) ?: []);
        }
        $data['updated_by'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            if ($page->cover_image_path) {
                Storage::disk('public')->delete($page->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('page-covers', 'public');
        }

        return DB::transaction(function () use ($page, $data) {
            if (! empty($data['is_home'])) {
                Page::where('is_home', true)->where('id', '!=', $page->id)->update(['is_home' => false]);
            }

            $page->update($data);

            return new PageResource($page->refresh()->load(['creator', 'updater', 'menuItems']));
        });
    }

    public function destroy(Request $request, Page $page): JsonResponse
    {
        $page->update(['deleted_by' => $request->user()->id]);
        $page->delete();

        return response()->json(status: 204);
    }

    public function trash()
    {
        return PageResource::collection(Page::onlyTrashed()->with(['creator', 'updater', 'deleter'])->latest('deleted_at')->paginate(15));
    }

    public function restore(int $page): PageResource
    {
        $record = Page::onlyTrashed()->findOrFail($page);
        $record->restore();
        $record->update(['deleted_by' => null]);

        return new PageResource($record->load(['creator', 'updater', 'deleter']));
    }

    public function forceDelete(int $page): JsonResponse
    {
        $record = Page::onlyTrashed()->findOrFail($page);
        if ($record->cover_image_path) {
            Storage::disk('public')->delete($record->cover_image_path);
        }
        $record->forceDelete();

        return response()->json(status: 204);
    }
}
