<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'page_id' => $this->page_id,
            'parent_id' => $this->parent_id,
            'position' => $this->position,
            'page' => $this->whenLoaded('page', fn () => $this->page ? ['id' => $this->page->id, 'title' => $this->page->title, 'slug' => $this->page->slug] : null),
            'children' => MenuItemResource::collection($this->whenLoaded('children')),
        ];
    }
}
