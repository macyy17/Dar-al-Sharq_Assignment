<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\PrivilegeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pages/trash', [PageController::class, 'trash'])->middleware('privilege:pages.restore');
    Route::post('/pages/{page}/restore', [PageController::class, 'restore'])->middleware('privilege:pages.restore');
    Route::delete('/pages/{page}/force', [PageController::class, 'forceDelete'])->middleware('privilege:pages.force_delete');
    Route::get('/pages', [PageController::class, 'index'])->middleware('privilege:pages.view');
    Route::post('/pages', [PageController::class, 'store'])->middleware('privilege:pages.create');
    Route::get('/pages/{page}', [PageController::class, 'show'])->middleware('privilege:pages.view');
    Route::match(['put', 'patch'], '/pages/{page}', [PageController::class, 'update'])->middleware('privilege:pages.update');
    Route::delete('/pages/{page}', [PageController::class, 'destroy'])->middleware('privilege:pages.delete');

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
