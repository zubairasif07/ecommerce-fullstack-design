<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

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

// Authentication routes (public)
Route::post('/auth/register-customer', [AuthController::class, 'registerCustomer']);
Route::post('/auth/register-seller', [AuthController::class, 'registerSeller']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Admin routes
Route::post('/admin/login', [AdminController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/profile', [AdminController::class, 'profile']);
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    
    // Dashboard
    Route::get('/admin/dashboard/stats', [AdminController::class, 'getDashboardStats']);
    
    // Sellers management
    Route::get('/admin/sellers', [AdminController::class, 'getSellers']);
    Route::get('/admin/sellers/{id}', [AdminController::class, 'getSellerDetails']);
    Route::post('/admin/sellers/{id}/verify', [AdminController::class, 'verifySeller']);
    Route::post('/admin/sellers/{id}/reject', [AdminController::class, 'rejectSeller']);
    
    // Users management
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::get('/admin/users/{id}', [AdminController::class, 'getUserDetails']);
});

// Public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/categories/{slug}/products', [CategoryController::class, 'products']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/search/{query}', [ProductController::class, 'search']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Product creation for sellers
    Route::post('/products', [ProductController::class, 'store']);

    // Seller dashboard routes
    Route::middleware('seller.verified')->group(function () {
        Route::get('/seller/dashboard', [\App\Http\Controllers\Api\SellerDashboardController::class, 'summary']);
        Route::get('/seller/store', [\App\Http\Controllers\Api\SellerDashboardController::class, 'store']);
    });
});

// Additional public route for stores (if needed)
