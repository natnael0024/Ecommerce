<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories',[CategoryController::class,'index']);
Route::get('/categories/{id}',[CategoryController::class,'show']);

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/products', [ProductController::class, 'store'])->middleware('can:create_products');
    // Route::put('/products/{id}', [ProductController::class, 'update'])->middleware('role:admin');

    Route::post('/products/{id}/update', [ProductController::class, 'update'])->middleware('can:edit_products');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware('can:delete_products');

    Route::post('/categories',[CategoryController::class,'store'])->middleware('role:admin');
    Route::put('/categories/{id}',[CategoryController::class,'update'])->middleware('role:admin');
    Route::delete('/categories/{id}',[CategoryController::class,'destroy'])->middleware('role:admin');
    
    Route::post('/orders',[OrderController::class,'store'])->middleware('can:place_orders');
    Route::get('/orders',[OrderController::class,'index'])->middleware('can:manage_orders');
    Route::get('/orders/customer',[OrderController::class,'getCustomerOrders']);
    Route::get('/orders/{id}/customer',[OrderController::class,'getCustomerOrder']);
    Route::get('/orders/{id}',[OrderController::class,'show'])->middleware('can:manage_orders');
    Route::post('/orders/{id}',[OrderController::class,'update'])->middleware('can:manage_orders');
    Route::put('/orders/{id}/status',[OrderController::class,'updateStatus'])->middleware('can:manage_orders');
    // Route::apiResource('/orders',OrderController::class);

    Route::apiResource('users',UserController::class)->middleware('role:admin');
    Route::get('getCustomers', [UserController::class,'getCustomers'])->middleware('can:manage_users');
    

    Route::get('/roles', [RoleController::class, 'index'])->middleware('role:admin');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('role:admin');      
    Route::get('/roles/{id}', [RoleController::class, 'show'])->middleware('role:admin');     
    Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('role:admin');    
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware('role:admin');    

    Route::get('/permissions', [PermissionController::class, 'index']);         
    Route::post('/permissions', [PermissionController::class, 'store']);       
    Route::get('/permissions/{id}', [PermissionController::class, 'show']);     
    Route::put('/permissions/{id}', [PermissionController::class, 'update']);   
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']); 

    Route::get( '/admin/analytics',[AdminController::class,'getAnalytics']);

    Route::get('/admin/order-status', [AdminController::class, 'getOrderStatusData']);
    Route::get('/admin/revenue-data', [AdminController::class, 'getRevenueData']);
    Route::get('/admin/order-analytics', [AdminController::class, 'getMonthlyOrderData']);
    
    Route::get('/admin/analytics2', [AdminController::class, 'getAnalyticsData']);
    Route::get('/admin/products',[AdminController::class,'getProducts']);

    Route::get('/admin/promotions', [AdminController::class, 'getPromosForAdmin']);       
    Route::post('/promotions', [AdminController::class, 'storePromo']);       
    Route::get('/promotions/{id}', [AdminController::class, 'showPromo']);     
    Route::post('/promotions/{id}', [AdminController::class, 'updatePromo']);   
    Route::delete('/promotions/{id}', [AdminController::class, 'destroyPromo']);
    
});
Route::get('/promotions', [AdminController::class, 'getPromos']);         

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route::post('/products', [ProductController::class, 'store'])->middleware('can:create_products');

Route::post('/assign-role', function (Request $request) {
    $user = User::find($request->user_id);
    $user->assignRole($request->role);
    return response()->json(['message' => 'Role assigned successfully']);
});