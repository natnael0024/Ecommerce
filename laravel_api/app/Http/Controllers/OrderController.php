<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use Auth;
use Illuminate\Http\Request;
use App\Models\Order;
class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::orderBy('created_at','desc')
            ->paginate(10); 

        return OrderResource::collection($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_ids'=>'required',
            'total_price'=>'required',
        ]);
        $validated['product_ids'] = json_encode($validated['product_ids']);
        $validated['user_id'] = Auth::id();
        
        $order = Order::create($validated);

        return new OrderResource($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::findOr($id);
        return new OrderResource($order);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'product_ids'=>'required|array',
            'total_price'=>'required',
        ]);
        $validated['product_ids'] = json_encode($validated['product_ids']);
        $validated['user_id'] = Auth::id();

        $order->update($validated);

        return new OrderResource($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json([],204);
    }
}