<?php

namespace App\Http\Controllers;

use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = [
            'published' => Page::publishedAndDue()->count(),
            'drafts' => Page::where('status', 'draft')->count(),
            'scheduled' => Page::where('status', 'published')->where('publish_at', '>', now())->count(),
            'recent_pages' => PageResource::collection(Page::with(['creator', 'updater', 'menuItems'])->latest('updated_at')->limit(4)->get()),
        ];
        if ($request->user()->hasPrivilege('users.view')) $data['active_users'] = User::where('is_active', true)->count();
        return response()->json($data);
    }
}
