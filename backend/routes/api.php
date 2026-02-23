<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ContactController;

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

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
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
});
