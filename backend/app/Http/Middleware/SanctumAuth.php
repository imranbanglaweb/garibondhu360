<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanctumAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated - No token'], 401);
        }

        // Handle token ID format: "id|token" (e.g., "53|abc...")
        if (strpos($token, '|') !== false) {
            [$id, $tokenValue] = explode('|', $token, 2);
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::find($id);
            
            if ($tokenModel && $tokenModel->token === hash('sha256', $tokenValue)) {
                $user = $tokenModel->tokenable;
                if ($user) {
                    $request->setUserResolver(fn() => $user);
                    auth()->setUser($user);
                    return $next($request);
                }
            }
            
            return response()->json(['message' => 'Unauthenticated - Invalid token format'], 401);
        }

        // Try to find token by plain text in DB (for older tokens)
        $tokenModel = \Laravel\Sanctum\PersonalAccessToken::where('token', $token)->first();

        // If not found, try hashed (standard Sanctum behavior)
        if (!$tokenModel) {
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $token))->first();
        }

        if (!$tokenModel) {
            return response()->json(['message' => 'Unauthenticated - Invalid token'], 401);
        }

        $user = $tokenModel->tokenable;

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated - No user'], 401);
        }

        $request->setUserResolver(fn() => $user);
        auth()->setUser($user);

        return $next($request);
    }
}