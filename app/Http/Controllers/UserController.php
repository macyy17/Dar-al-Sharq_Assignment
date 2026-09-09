<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::with('role')->latest()->paginate(20));
    }

    public function store(StoreUserRequest $request): UserResource
    {
        return new UserResource(User::create($request->validated())->load('role'));
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->load('role'));
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $data = $request->validated();
        if (blank($data['password'] ?? null)) unset($data['password']);
        $user->update($data);

        return new UserResource($user->refresh()->load('role'));
    }

    public function destroy(User $user): JsonResponse
    {
        abort_if(auth()->id() === $user->id, 422, 'You cannot delete your own account.');
        $user->delete();
        return response()->json(status: 204);
    }
}
