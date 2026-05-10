<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AdminController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        $totalOrders = Order::count();
        $totalUsers = User::count();

        // 7-day revenue history
        $revenueHistory = Order::selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Category sales breakdown
        $categorySales = \DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->selectRaw('categories.name as category, SUM(order_items.price * order_items.quantity) as revenue')
            ->groupBy('categories.name')
            ->get();

        return response()->json([
            'revenue' => $totalRevenue,
            'orders' => $totalOrders,
            'users' => $totalUsers,
            'revenueHistory' => $revenueHistory,
            'categorySales' => $categorySales
        ]);
    }

    public function users()
    {
        $users = User::withCount('orders')->withSum('orders', 'total')->get();
        return response()->json($users);
    }

    public function exportOrdersCsv()
    {
        $orders = Order::with('user')->latest()->get();
        
        $filename = "orders_export_" . date('Y_m_d_H_i_s') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        $columns = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Status', 'Total ($)'];
        
        $callback = function() use($orders, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($orders as $order) {
                $row = [
                    $order->id,
                    $order->user ? $order->user->name : 'Guest',
                    $order->user ? $order->user->email : '',
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->status,
                    $order->total
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    public function orders()
    {
        return response()->json(Order::with('user', 'items.product')->latest()->get());
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json($order);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'old_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|string',
            'stock' => 'required|integer',
        ]);
        
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'old_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|string',
            'stock' => 'required|integer',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroyProduct($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
