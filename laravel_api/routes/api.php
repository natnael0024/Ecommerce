<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/products', [ProductController::class, 'store'])->middleware('role:admin');
    // Route::put('/products/{id}', [ProductController::class, 'update'])->middleware('role:admin');

    Route::post('/products/{id}/update', [ProductController::class, 'update'])->middleware('role:admin');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware('role:admin');

    Route::apiResource('/categories',CategoryController::class)->middleware('role:admin');

    Route::apiResource('/orders',OrderController::class);

    Route::get( '/admin/analytics',[AdminController::class,'getAnalytics']);
    
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Route::post('/products', [ProductController::class, 'store'])->middleware('can:create_products');

Route::post('/assign-role', function (Request $request) {
    $user = User::find($request->user_id);
    $user->assignRole($request->role);
    return response()->json(['message' => 'Role assigned successfully']);
});