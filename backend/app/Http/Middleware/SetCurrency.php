<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrency
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set default currency for the application
        config(['currency.default' => 'MAD']);
        
        // You can also set currency based on user preference or location
        // if ($request->user()) {
        //     config(['currency.default' => $request->user()->preferred_currency ?? 'MAD']);
        // }
        
        return $next($request);
    }
}