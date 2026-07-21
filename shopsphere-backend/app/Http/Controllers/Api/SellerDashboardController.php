<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerDashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalRevenue = Order::sum('total');

        // Optional: compute top products by order quantity
        $topProducts = Order::all()
            ->flatMap(function ($order) {
                return collect($order->items ?: [])->pluck('product_id');
            })
            ->countBy()
            ->sortDesc()
            ->take(4)
            ->map(function ($count, $productId) {
                $product = Product::find($productId);
                return [
                    'id' => (int) $productId,
                    'name' => $product ? $product->name : 'Unknown product',
                    'sales' => $count,
                ];
            })
            ->values();

        return response()->json([
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_revenue' => "$" . number_format($totalRevenue, 2),
            'top_products' => $topProducts,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $orderCount = Order::where('user_id', $request->user()->id)->count();
        $revenue = Order::where('user_id', $request->user()->id)->sum('total');

        return response()->json([
            'storeName' => $request->user()->name ?? 'Your Store',
            'ownerName' => $request->user()->name ?? 'Seller',
            'rating' => 4.8,
            'totalProducts' => Product::count(),
            'totalOrders' => $orderCount,
            'pendingOrders' => Order::where('status', 'pending')->count(),
            'totalRevenue' => "$" . number_format($revenue, 2),
            'followers' => 1250,
            'recentOrders' => Order::orderBy('created_at', 'desc')->limit(5)->get(),
            'topProducts' => Product::orderBy('created_at', 'desc')->limit(4)->get(),
        ]);
    }
}
