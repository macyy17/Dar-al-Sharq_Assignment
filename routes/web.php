<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('guest');
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });
});

Route::view('/{path?}', 'welcome')->where('path', '^(?!api|sanctum|api/documentation).*$');
