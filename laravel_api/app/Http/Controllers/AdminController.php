<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use App\Services\SupabaseService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
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
    public function getAnalyticsData()
    {
        try {
            // Basic Analytics Data
            $totalProducts = Product::count();
            $totalOrders = Order::count();
            $totalUsers = User::count();
            $totalRevenue = Order::whereNot('status', 'cancelled')->sum('total_price');
            
            // Order Status Data
            $delivered = Order::where('status', 'delivered')->count();
            $pending = Order::where('status', 'pending')->count();
            $shipped = Order::where('status', 'shipped')->count();
            $processing = Order::where('status', 'processing')->count();
            $cancelled = Order::where('status', 'cancelled')->count();

            // Monthly Revenue Data
            $year = Carbon::now()->year;
            $monthlyRevenue = [];
            for ($month = 1; $month <= 12; $month++) {
                $totalRevenuePerMonth = Order::whereYear('created_at', $year)
                    ->whereNot('status', 'cancelled')
                    ->whereMonth('created_at', $month)
                    ->sum('total_price');
                $monthlyRevenue[] = $totalRevenuePerMonth;
            }

            // Monthly Orders Data
            $monthlyOrders = [];
            for ($month = 1; $month <= 12; $month++) {
                $orderCount = Order::whereYear('created_at', $year)
                    ->whereMonth('created_at', $month)
                    ->count();
                $monthlyOrders[] = $orderCount;
            }

            // Return all data in a single response
            return response()->json([
                'basicAnalytics' => [
                    'totalProducts' => $totalProducts,
                    'totalOrders' => $totalOrders,
                    'totalUsers' => $totalUsers,
                    'totalRevenue' => $totalRevenue
                ],
                'orderStatusData' => [
                    'labels' => ['Delivered', 'Pending', 'Shipped', 'Processing', 'Cancelled'],
                    'datasets' => [
                        [
                            'data' => [$delivered, $pending, $shipped, $processing, $cancelled],
                            'backgroundColor' => ['#42eb50', '#d5d8d9', '#00a2ff', '#81d1ff', '#ff2600'],
                        ],
                    ],
                ],
                'monthlyRevenueData' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    'datasets' => [
                        [
                            'label' => 'Revenue ($)',
                            'data' => $monthlyRevenue,
                            'borderColor' => '#007bff',
                            'backgroundColor' => 'rgba(0, 123, 255, 0.2)',
                            'fill' => true,
                            'tension' => 0.4,
                        ],
                    ],
                ],
                'monthlyOrdersData' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    'datasets' => [
                        [
                            'label' => 'Monthly Orders',
                            'data' => $monthlyOrders,
                            'backgroundColor' => '#0379e0',
                            'tension' => 0.4,
                        ],
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    
    public function index()
    {
        
    }

    public function getAnalytics()
    {
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalUsers = User::count();
        $totalRevenue = Order::whereNot('status','cancelled')
            ->sum('total_price');

        return response()->json([
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'totalUsers' => $totalUsers,
            'totalRevenue' => $totalRevenue
        ]);
    }

    // *** PROMO MANAGEMENT *** //////////////////////////////////
    public function getPromos(Request $request)
    {
        $currentDate = Carbon::now();
        $pos = $request->input('pos');

        $query = Promotion::where('status', true) 
            ->where('end_date', '>=', $currentDate);
            
        if($pos){
            $query->where('position', $pos);
        }
        $promotions = $query->orderBy('start_date', 'asc') 
            ->get();

        return response()->json(['promotions' => $promotions]);
    }

    public function showPromo(Request $request, $id)
    {
        $promotion = Promotion::where('id',$id)
            ->orderBy('start_date', 'asc') 
            ->get();

        return response()->json(['promotion' => $promotion]);
    }

    public function getPromosForAdmin()
    {
        $promotions = Promotion::orderBy('created_at', 'desc') 
            ->get();

        return response()->json(['promotions' => $promotions]);
    }

    public function storePromo(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'description'  => 'required|string|max:1000',
            'start_date'   => 'required',
            'end_date'     => 'required',
            'media'        => 'nullable|max:10240', 
            'position'     => 'required|in:home-slider,product-page,cart-page,checkout,popup', 
            'status'       => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mediaPath = null;
        if($request->hasFile('media'))
        {
            try{
                $media = $request->file('media');
                $result = $this->supabase->upload($media, 'promotions');
                $mediaPath = $result['url'];
            } catch(\Exception $e){
                return response()->json($e->getMessage(),400);
            }
        }

        $status = $request->input('status') == 'active' ? true : false;

        // Create the new promotion
        // dd($status,$request);
        try {
            $promotion = Promotion::create([
                'title'        => $request->input('title'),
                'description'  => $request->input('description'),
                'start_date'   => $request->input('start_date'),
                'end_date'     => $request->input('end_date'),
                'media_path'   => $mediaPath, 
                'position'     => $request->input('position'),
                'status'       => $status,
            ]);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(),400);
        }

        // Return a success response with the promotion data
        return response()->json(['message' => 'Promotion created successfully', 'promotion' => $promotion], 201);
    }

    public function updatePromo(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string|max:1000',
            'start_date'   => 'sometimes',
            'end_date'     => 'sometimes',
            'media'   => 'sometimes|max:10240', 
            'position'     => 'sometimes|in:home-slider,popup,checkout,product-page,cart-page', 
            'status'       => 'sometimes', 
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only('title','description','start_date','end_date','position');

        if($request->hasFile('media'))
        {
            try{
                if ($promotion->media_path) {
                    $this->supabase->deleteImage($promotion->media_path);
                }
                $media = $request->file('media');
                $result = $this->supabase->upload($media, 'promotions');
                $data['media_path'] = $result['url'];
            } catch(\Exception $e){
                return response()->json($e->getMessage(),400);
            }
        }

        if($request){
            $status = $request->input('status') == 'active' ? true : false;
            $data['status'] = $status;
        }

        try {
            $promotion->update($data);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(),400);
        }

        return response()->json(['message' => 'Promotion updated successfully', 'promotion' => $promotion]);
    }

    public function destroyPromo($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        if ($promotion->media_path) {
            $this->supabase->deleteImage($promotion->media_path);
        }

        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted successfully']);
    }

    public function updatePromoStatus(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:'.true.','.false,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion->status = $request->input('status');
        $promotion->save();

        return response()->json(['message' => 'Promotion status updated successfully', 'promotion' => $promotion]);
    }

    public function getOrderStatusData()
    {
        $delivered = Order::where('status', 'delivered')->count();
        $pending = Order::where('status', 'pending')->count();
        $shipped = Order::where('status', 'shipped')->count();
        $processing = Order::where('status', 'processing')->count();
        $cancelled = Order::where('status', 'cancelled')->count();

        return response()->json([
            'labels' => ['Delivered', 'Pending','Shipped','Processing', 'Cancelled'],
            'datasets' => [
                [
                    'data' => [$delivered, $pending, $shipped, $processing, $cancelled],
                    'backgroundColor' => ['#42eb50', '#d5d8d9', '#00a2ff','#81d1ff','#ff2600'],
                ],
            ],
        ]);
    }

    public function getRevenueData()
    {
        try {
            $year = Carbon::now()->year;

        $monthlyRevenue = [];

        for ($month = 1; $month <= 12; $month++) {
            $totalRevenue = Order::whereYear('created_at', $year)
                ->whereNot('status','cancelled')
                ->whereMonth('created_at', $month)
                ->sum('total_price');

            $monthlyRevenue[] = $totalRevenue;
        }

        return response()->json([
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'datasets' => [
                [
                    'label' => 'Revenue ($)',
                    'data' => $monthlyRevenue,
                    'borderColor' => '#007bff',
                    'backgroundColor' => 'rgba(0, 123, 255, 0.2)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
        ]);
        } catch (\Exception $e) {
            return response()->json(['message'=>$e->getMessage()],400);
        }
    }

    public function getMonthlyOrderData()
    {
        $year = Carbon::now()->year;

        $monthlyOrders = [];

        for ($month = 1; $month <= 12; $month++) {
            $orderCount = Order::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();

            $monthlyOrders[] = $orderCount;
        }

        return response()->json([
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'datasets' => [
                [
                    'label' => 'Monthly Orders',
                    'data' => $monthlyOrders,
                    'backgroundColor' => '#0379e0',
                    'tension' => 0.4,
                ],
            ],
        ]);
    }
}
