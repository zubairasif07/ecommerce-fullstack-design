<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CheckSellerVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Check if user is a seller
        if ($user->user_type !== 'seller') {
            return response()->json([
                'error' => 'Access denied. Only sellers can access this resource.'
            ], 403);
        }

        // Check if seller is verified
        if (!$user->is_seller_verified) {
            return response()->json([
                'error' => 'Your seller account is pending verification. Please wait for admin approval.',
                'verified' => false
            ], 403);
        }

        return $next($request);
    }
}
