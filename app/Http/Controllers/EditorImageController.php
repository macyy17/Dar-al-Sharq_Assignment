<?php

namespace App\Http\Controllers;

use App\Http\Requests\EditorImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class EditorImageController extends Controller
{
    public function store(EditorImageRequest $request): JsonResponse
    {
        $path = $request->file('upload')->store('page-content', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
