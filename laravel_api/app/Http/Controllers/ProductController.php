<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use App\Services\SupabaseService;

class ProductController extends Controller
{
    protected $supabase;
    public function __construct(SupabaseService $supabaseService)
    {
        $this->supabase = $supabaseService;
        // $this->middleware('permission:create_products', ['only' => ['store']]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::paginate(10);
        return ProductResource::collection($products);
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
            'name'=>'required',
            'description'=>'nullable|string',
            'price'=>'required',
            'quantity'=>'nullable',
            'category_id'=>'nullable'
            // 'image_path'=>'nullable'
        ]);

        if($request->hasFile('image'))
        {
            $image = $request->file('image');
            $imageName = 'product_' . $validated['name'] . '_' . time() . '.' . $image->extension();
            $imagePath = $image->move(public_path('product_images'), $imageName);
            $validated['image_path'] = asset('product_images/' . $imageName);
        }

        $prod = Product::create($validated);

        return new ProductResource($prod);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return new ProductResource($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name'=>'sometimes',
            'description'=>'sometimes|string',
            'price'=>'sometimes',
            'quantity'=>'sometimes',
            // 'image_path'=>'nullable'
        ]);

        if($request->hasFile('image'))
        {
            $image = $request->file('image');
            $imageName = 'product_' . $validated['name'] . '_' . time() . '.' . $image->extension();
            // $imagePath = $image->storeAs('public/product_images', $imageName);   
            $imagePath = $image->move(public_path('product_images'), $imageName);
            $validated['image_path'] = asset('product_images/' . $imageName);
        }

        $product->update($validated);
        $product = Product::findOrFail($id);

        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image_path) {
            $imagePath = public_path('product_images/' . basename($product->image_path));
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        $product->delete();

        return response()->json([], 204);
    }
}
