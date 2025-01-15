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
            // $imageName = 'product'.'_'.$validated['name'].'_'.time().'.'.$request->image->extension();
            // $image->storeAs('public/product_images', $imageName);
            // $validated['image_path'] = $imageName;
            
            // supabse upload
            try{
                $result = $this->supabase->uploadImage($image, 'products');
                $validated['image_path'] = $result['url'];
            } catch(\Exception $e){
                return response()->json($e->getMessage());
            }
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
            'name'=>'required',
            'description'=>'nullable|string',
            'price'=>'required',
            'quantity'=>'nullable',
            // 'image_path'=>'nullable'
        ]);

        if($request->hasFile('image'))
        {
            $image = $request->file('image');    
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image_path) {
            $this->supabase->deleteImage($product->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.'], 204);
    }
}
