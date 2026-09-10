<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemRequest;
use App\Http\Requests\ReorderMenuItemsRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItemResource::collection(MenuItem::with('page')->orderBy('parent_id')->orderBy('position')->get());
    }

    public function store(MenuItemRequest $request): MenuItemResource
    {
        $data = $request->validated();
        $data['position'] ??= MenuItem::where('parent_id', $data['parent_id'] ?? null)->max('position') + 1;
        return new MenuItemResource(MenuItem::create($data)->load('page'));
    }

    public function show(MenuItem $menuItem): MenuItemResource
    {
        return new MenuItemResource($menuItem->load('page'));
    }

    public function update(MenuItemRequest $request, MenuItem $menuItem): MenuItemResource
    {
        $data = $request->validated();
        $this->assertNoCycle($menuItem->id, $data['parent_id'] ?? null);
        $menuItem->update($data);
        return new MenuItemResource($menuItem->refresh()->load('page'));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();
        return response()->json(status: 204);
    }

    public function reorder(ReorderMenuItemsRequest $request): JsonResponse
    {
        $items = collect($request->validated('items'))->keyBy('id');
        foreach ($items as $id => $item) {
            $parent = $item['parent_id'] ?? null;
            if ($parent !== null && (int) $parent === (int) $id) {
                throw ValidationException::withMessages(['items' => ['A menu item cannot be its own parent.']]);
            }
            $seen = [(int) $id];
            while ($parent !== null && $items->has($parent)) {
                if (in_array((int) $parent, $seen, true)) {
                    throw ValidationException::withMessages(['items' => ['Menu nesting cannot contain cycles.']]);
                }
                $seen[] = (int) $parent;
                $parent = $items->get($parent)['parent_id'] ?? null;
            }
        }

        DB::transaction(fn () => $items->each(fn ($item, $id) => MenuItem::whereKey($id)->update([
            'parent_id' => $item['parent_id'] ?? null,
            'position' => $item['position'],
        ])));

        return response()->json(['message' => 'Menu order saved.']);
    }

    private function assertNoCycle(int $id, ?int $parentId): void
    {
        $seen = [$id];
        while ($parentId) {
            if (in_array($parentId, $seen, true)) {
                throw ValidationException::withMessages(['parent_id' => ['This parent would create a cycle.']]);
            }
            $seen[] = $parentId;
            $parentId = MenuItem::whereKey($parentId)->value('parent_id');
        }
    }
}
