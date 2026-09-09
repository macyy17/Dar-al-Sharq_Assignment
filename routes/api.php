<?php

use App\Http\Controllers\PrivilegeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->middleware('privilege:users.view');
    Route::post('/users', [UserController::class, 'store'])->middleware('privilege:users.create');
    Route::get('/users/{user}', [UserController::class, 'show'])->middleware('privilege:users.view');
    Route::match(['put', 'patch'], '/users/{user}', [UserController::class, 'update'])->middleware('privilege:users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('privilege:users.delete');

    Route::get('/roles', [RoleController::class, 'index'])->middleware('privilege:roles.view');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('privilege:roles.create');
    Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware('privilege:roles.view');
    Route::match(['put', 'patch'], '/roles/{role}', [RoleController::class, 'update'])->middleware('privilege:roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('privilege:roles.delete');

    Route::get('/privileges', [PrivilegeController::class, 'index'])->middleware('privilege:privileges.view');
    Route::post('/privileges', [PrivilegeController::class, 'store'])->middleware('privilege:privileges.create');
    Route::get('/privileges/{privilege}', [PrivilegeController::class, 'show'])->middleware('privilege:privileges.view');
    Route::match(['put', 'patch'], '/privileges/{privilege}', [PrivilegeController::class, 'update'])->middleware('privilege:privileges.update');
    Route::delete('/privileges/{privilege}', [PrivilegeController::class, 'destroy'])->middleware('privilege:privileges.delete');
});
