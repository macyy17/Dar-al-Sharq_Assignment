<?php

namespace App\Http\Controllers;

use App\Http\Resources\PageResource;
use App\Models\MenuItem;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    public function navigation(): JsonResponse
    {
        $items = MenuItem::with('page')->orderBy('position')->get();
        $visible = $items->filter(fn ($item) => ! $item->page_id || ($item->page && Page::publishedAndDue()->whereKey($item->page_id)->exists()));

        $build = function ($parentId = null) use (&$build, $visible) {
            return $visible->where('parent_id', $parentId)->values()->map(function ($item) use (&$build) {
                $children = $build($item->id);
                if (! $item->page_id && $children->isEmpty()) return null;
                return [
                    'id' => $item->id,
                    'label' => $item->label,
                    'url' => $item->page ? '/pages/'.$item->page->slug : null,
                    'children' => $children->filter()->values(),
                ];
            })->filter()->values();
        };

        return response()->json(['data' => $build()]);
    }

    public function page(string $slug): PageResource
    {
        $page = Page::publishedAndDue()->where('slug', $slug)->firstOrFail();
        return new PageResource($page);
    }
}
