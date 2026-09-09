<?php

use App\Http\Controllers\PrivilegeController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
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
