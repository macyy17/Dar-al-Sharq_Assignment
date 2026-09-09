<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        return RoleResource::collection(Role::with('privileges')->withCount(['users', 'privileges'])->orderBy('name')->get());
    }

    public function store(RoleRequest $request): RoleResource
    {
        $role = DB::transaction(function () use ($request) {
            $data = $request->validated();
            $ids = $data['privilege_ids'] ?? [];
            unset($data['privilege_ids']);
            $role = Role::create($data);
            $role->privileges()->sync($ids);
            return $role;
        });

        return new RoleResource($role->load('privileges')->loadCount(['users', 'privileges']));
    }

    public function show(Role $role): RoleResource
    {
        return new RoleResource($role->load('privileges')->loadCount(['users', 'privileges']));
    }

    public function update(RoleRequest $request, Role $role): RoleResource
    {
        DB::transaction(function () use ($request, $role) {
            $data = $request->validated();
            $ids = $data['privilege_ids'] ?? [];
            unset($data['privilege_ids']);
            $role->update($data);
            $role->privileges()->sync($ids);
        });

        return new RoleResource($role->refresh()->load('privileges')->loadCount(['users', 'privileges']));
    }

    public function destroy(Role $role): JsonResponse
    {
        abort_if($role->users()->exists(), 409, 'This role is assigned to users and cannot be deleted.');
        $role->delete();
        return response()->json(status: 204);
    }
}
