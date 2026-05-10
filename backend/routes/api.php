<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/promotions/validate', [App\Http\Controllers\PromotionController::class, 'validateCode']);

Route::get('/settings', [\App\Http\Controllers\SettingController::class, 'index']);
Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

});

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PromotionController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware('is_admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/orders', [AdminController::class, 'orders']);
        Route::put('/admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
        
        // Advanced Features
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/orders/export', [AdminController::class, 'exportOrdersCsv']);
        Route::get('/admin/promotions', [PromotionController::class, 'index']);
        Route::post('/admin/promotions', [PromotionController::class, 'store']);
        Route::delete('/admin/promotions/{id}', [PromotionController::class, 'destroy']);

        // Products CRUD (Admin only)
        Route::post('/admin/products', [AdminController::class, 'storeProduct']);
        Route::put('/admin/products/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/admin/products/{id}', [AdminController::class, 'destroyProduct']);

        // Settings (Admin)
        Route::post('/admin/settings', [\App\Http\Controllers\SettingController::class, 'update']);

        // Categories (Admin)
        Route::post('/admin/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
        Route::put('/admin/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
    });
});
