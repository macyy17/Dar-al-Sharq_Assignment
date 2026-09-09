<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'status' => $this->is_active ? 'Active' : 'Suspended',
            'last_seen_at' => $this->last_seen_at?->toIso8601String(),
            'role' => $this->role ? ['id' => $this->role->id, 'name' => $this->role->name] : null,
            'privileges' => $this->when($request->routeIs('auth.me'), fn () => $this->privilegeNames()),
        ];
    }
}
