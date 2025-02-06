<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\OrderItem;
use Auth;
use Illuminate\Http\Request;
use App\Models\Order;
use Validator;
class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['user', 'items']) // Load related user and order items
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
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
        // return response()->json(['message'=>'Failed'], 200);

        $validated = Validator::make($request->all(),[
            'cartItems' => 'required|array',
            'cartItems.*.id' => 'required|exists:products,id',
            'cartItems.*.name' => 'required|string',
            'cartItems.*.price' => 'required|numeric',
            'cartItems.*.quantity' => 'required|integer|min:1',
            'shippingDetails.name' => 'required|string|max:255',
            'shippingDetails.address' => 'required|string',
            'shippingDetails.city' => 'required|string|max:255',
            'shippingDetails.zip' => 'required|string|max:10',
            'shippingDetails.country' => 'required|string|max:100',
        ]);

        if ($validated->fails()) {
            return response()->json($validated->errors(), 422);
        }

        // Calculate total price
        $totalPrice = collect($request->cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_price' => $totalPrice,
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipping_name' => $request->shippingDetails['name'],
            'shipping_address' => $request->shippingDetails['address'],
            'shipping_city' => $request->shippingDetails['city'],
            'shipping_zip' => $request->shippingDetails['zip'],
            'shipping_country' => $request->shippingDetails['country'],
        ]);

        foreach ($request->cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json(new OrderResource($order),201);
    }

    public function updateStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order = Order::findOrFail($orderId);
        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Order status updated successfully!',
            'order' => $order
        ],200);
    }

    public function updatePaymentStatus(Request $request, $orderId)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,failed'
        ]);
    
        $order = Order::findOrFail($orderId);
        $order->update(['payment_status' => $request->payment_status]);
    
        return response()->json([
            'message' => 'Payment status updated successfully!',
            'order' => $order
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::findOr($id);
        return response()->json(new OrderResource($order));
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

        return response()->json(new OrderResource($order));
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