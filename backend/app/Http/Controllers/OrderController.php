<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'promo_code' => 'nullable|string',
            'customer' => 'required|array',
            'customer.first_name' => 'required|string',
            'customer.last_name' => 'required|string',
            'customer.phone' => 'required|string',
            'customer.street' => 'required|string',
            'customer.city' => 'required|string',
            'customer.state' => 'required|string',
            'customer.zip' => 'required|string',
            'payment_method' => 'required|string|in:cod',
        ]);

        DB::beginTransaction();
        try {
            $subtotal = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $price = $product->price;
                $subtotal += $price * $item['quantity'];

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ];
            }

            $discount = 0;
            if ($request->promo_code) {
                $promo = \App\Models\Promotion::where('code', $request->promo_code)->first();
                if ($promo && (!$promo->valid_until || !$promo->valid_until->isPast()) && (!$promo->usage_limit || $promo->times_used < $promo->usage_limit)) {
                    $discount = $subtotal * ($promo->discount_percent / 100);
                    $promo->increment('times_used');
                }
            }

            $shipping = count($orderItems) > 0 ? 9.99 : 0;
            $tax = ($subtotal - $discount) * 0.08;
            $total = ($subtotal - $discount) + $shipping + $tax;

            $order = $request->user()->orders()->create([
                'total' => max(0, $total),
                'status' => 'pending',
                'shipping_details' => $request->customer,
                'payment_method' => $request->payment_method,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            DB::commit();
            return response()->json($order->load('items.product'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed', 'error' => $e->getMessage()], 500);
        }
    }
}
