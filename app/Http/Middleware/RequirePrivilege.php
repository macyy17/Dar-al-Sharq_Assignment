<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePrivilege
{
    public function handle(Request $request, Closure $next, string $privilege): Response
    {
        abort_unless($request->user()?->hasPrivilege($privilege), 403);
        return $next($request);
    }
}
