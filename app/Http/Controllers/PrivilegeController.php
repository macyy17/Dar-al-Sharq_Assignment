<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrivilegeRequest;
use App\Http\Resources\PrivilegeResource;
use App\Models\Privilege;
use Illuminate\Http\JsonResponse;

class PrivilegeController extends Controller
{
    public function index()
    {
        return PrivilegeResource::collection(Privilege::orderBy('group')->orderBy('name')->get());
    }

    public function store(PrivilegeRequest $request): PrivilegeResource
    {
        return new PrivilegeResource(Privilege::create($request->validated()));
    }

    public function show(Privilege $privilege): PrivilegeResource
    {
        return new PrivilegeResource($privilege);
    }

    public function update(PrivilegeRequest $request, Privilege $privilege): PrivilegeResource
    {
        $privilege->update($request->validated());
        return new PrivilegeResource($privilege->refresh());
    }

    public function destroy(Privilege $privilege): JsonResponse
    {
        $privilege->delete();
        return response()->json(status: 204);
    }
}
