<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Promotion;

class PromotionController extends Controller
{
    public function index()
    {
        return response()->json(Promotion::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promotions',
            'discount_percent' => 'required|integer|min:1|max:100',
            'valid_until' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        $promotion = Promotion::create($validated);
        return response()->json($promotion, 201);
    }

    public function destroy($id)
    {
        Promotion::findOrFail($id)->delete();
        return response()->json(['message' => 'Promotion deleted']);
    }

    public function validateCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $promo = Promotion::where('code', $request->code)->first();
        
        if (!$promo) {
            return response()->json(['message' => 'Invalid promo code.'], 404);
        }

        if ($promo->valid_until && $promo->valid_until->isPast()) {
            return response()->json(['message' => 'This promo code has expired.'], 400);
        }

        if ($promo->usage_limit && $promo->times_used >= $promo->usage_limit) {
            return response()->json(['message' => 'This promo code has reached its usage limit.'], 400);
        }

        return response()->json($promo);
    }
}
