<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DemoRequestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// All routes under /backend/public/ prefix handled by web middleware
Route::prefix('backend/public')->group(function () {
    Route::get('/', function () {
        return response()->json(['message' => 'Welcome to Garibondhu 360 API']);
    });

    Route::get('test', function () {
        return ['status' => 'ok'];
    });

    // Public Routes
    Route::post('api/register', [AuthController::class, 'register']);
    Route::post('api/login', [AuthController::class, 'login']);
    Route::post('api/contact', [ContactController::class, 'store']);
    Route::post('api/demo-request', [DemoRequestController::class, 'store']);

    // Public Stats
    Route::get('api/public-stats', [PublicController::class, 'stats']);

    // Packages (Public)
    Route::get('api/packages', [SubscriptionController::class, 'packages']);
    Route::get('api/packages/{id}', [SubscriptionController::class, 'package']);

    // Subscribe & Payment (Public)
    Route::post('api/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('api/submit-payment', [SubscriptionController::class, 'submitPayment']);
});
