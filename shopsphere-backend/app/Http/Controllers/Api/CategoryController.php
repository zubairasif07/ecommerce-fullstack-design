<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with('products')->get();
        return response()->json($categories);
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->with('products')
            ->firstOrFail();
        
        return response()->json($category);
    }

    public function products(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $products = $category->products()->where('is_active', true)->get();
        
        return response()->json($products);
    }
}
