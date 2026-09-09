<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): UserResource
    {
        $credentials = $request->validated();
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! $user->is_active || ! Auth::attempt($credentials)) {
            throw ValidationException::withMessages(['email' => ['The provided credentials are invalid.']]);
        }

        $request->session()->regenerate();
        $user->forceFill(['last_seen_at' => now()])->save();

        return new UserResource($user->load('role.privileges'));
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user()->load('role.privileges'));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::forgetGuards();

        return response()->json(['message' => 'Logged out.']);
    }
}
