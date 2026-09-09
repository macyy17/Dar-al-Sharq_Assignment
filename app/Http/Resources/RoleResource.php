<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'users_count' => $this->whenCounted('users'),
            'privileges_count' => $this->whenCounted('privileges'),
            'privileges' => $this->whenLoaded('privileges', fn () => $this->privileges->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])),
        ];
    }
}
