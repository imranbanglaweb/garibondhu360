<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DemoRequestController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/demo-request', [DemoRequestController::class, 'store']);

// Public Stats
Route::get('/public-stats', [PublicController::class, 'stats']);

// Packages (Public)
Route::get('/packages', [SubscriptionController::class, 'packages']);
Route::get('/packages/{id}', [SubscriptionController::class, 'package']);

// Protected Routes - custom token authentication
Route::middleware('token.auth')->group(function () {
    Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('/submit-payment', [SubscriptionController::class, 'submitPayment']);
    Route::get('/my-payments', [SubscriptionController::class, 'myPayments']);
    Route::get('/my-payments/{id}', [SubscriptionController::class, 'payment']);
    Route::get('/my-subscriptions', [SubscriptionController::class, 'mySubscriptions']);
    Route::get('/my-active-subscription', [SubscriptionController::class, 'myActiveSubscription']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-requisitions', [DashboardController::class, 'recentRequisitions']);
    
    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);
    
    // Drivers
    Route::apiResource('drivers', DriverController::class);
    
    // Requisitions
    Route::apiResource('requisitions', RequisitionController::class);
    Route::patch('/requisitions/{requisition}/approve', [RequisitionController::class, 'approve']);
    Route::patch('/requisitions/{requisition}/reject', [RequisitionController::class, 'reject']);
    
    // Contacts (Admin only)
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::patch('/contacts/{contact}/status', [ContactController::class, 'updateStatus']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
    
    // Demo Requests (Admin only)
    Route::get('/demo-requests', [DemoRequestController::class, 'index']);
    Route::get('/demo-requests/{demoRequest}', [DemoRequestController::class, 'show']);
    Route::patch('/demo-requests/{demoRequest}/status', [DemoRequestController::class, 'updateStatus']);
    Route::delete('/demo-requests/{demoRequest}', [DemoRequestController::class, 'destroy']);
    
    // Subscriptions & Payments (User)
    Route::get('/my-subscriptions', [SubscriptionController::class, 'mySubscriptions']);
    Route::get('/my-active-subscription', [SubscriptionController::class, 'myActiveSubscription']);
    Route::get('/my-payments', [SubscriptionController::class, 'myPayments']);
    Route::get('/my-payments/{id}', [SubscriptionController::class, 'payment']);
    
    // Subscriptions & Payments (Admin)
    Route::get('/all-payments', [SubscriptionController::class, 'allPayments']);
    Route::patch('/payments/{id}/verify', [SubscriptionController::class, 'verifyPayment']);
    Route::get('/all-subscriptions', [SubscriptionController::class, 'allSubscriptions']);
    
    // Users (Admin/TransportAdmin)
    Route::get('/users', [UsersController::class, 'index']);
    Route::get('/users/{user}', [UsersController::class, 'show']);
    Route::post('/users', [UsersController::class, 'store']);
    Route::put('/users/{user}', [UsersController::class, 'update']);
    Route::delete('/users/{user}', [UsersController::class, 'destroy']);
});
