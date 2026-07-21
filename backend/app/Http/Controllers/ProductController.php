<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');
        if ($request->has('category') && $request->category !== 'All') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(Product::with('category')->findOrFail($id));
    }
}
