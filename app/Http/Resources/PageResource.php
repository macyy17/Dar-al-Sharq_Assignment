<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
                'body' => $this->body ?? '',
                'blocks' => $this->blocks ?? [],
                'is_home' => (bool) $this->is_home,
            'status' => $this->status,
            'publishing_state' => $this->publishing_state,
            'publish_at' => $this->publish_at?->toIso8601String(),
            'cover_image_url' => $this->cover_image_path ? Storage::url($this->cover_image_path) : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
            'creator' => $this->whenLoaded('creator', fn () => ['id' => $this->creator->id, 'name' => $this->creator->name]),
            'updater' => $this->whenLoaded('updater', fn () => ['id' => $this->updater->id, 'name' => $this->updater->name]),
            'deleter' => $this->whenLoaded('deleter', fn () => $this->deleter ? ['id' => $this->deleter->id, 'name' => $this->deleter->name] : null),
            'menu_items' => $this->whenLoaded('menuItems', fn () => $this->menuItems->map(fn ($item) => ['id' => $item->id, 'label' => $item->label])),
        ];
    }
}
