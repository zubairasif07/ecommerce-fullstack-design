<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories if they don't exist
        if (Category::count() === 0) {
            Category::create([
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and gadgets',
            ]);

            Category::create([
                'name' => 'Fashion',
                'slug' => 'fashion',
                'description' => 'Clothing and accessories',
            ]);

            Category::create([
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Home improvement and garden supplies',
            ]);
        }

        $categories = Category::all();

        // Temporary test products for development
        Product::create([
            'name' => 'Wireless Bluetooth Headphones',
            'slug' => 'wireless-bluetooth-headphones',
            'description' => 'High-quality wireless headphones with noise cancellation',
            'category_id' => $categories->first()->id,
            'price' => 99.99,
            'stock' => 50,
            'sku' => 'WBH-001',
            'image' => null,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Smart Watch Series 5',
            'slug' => 'smart-watch-series-5',
            'description' => 'Latest smartwatch with health monitoring features',
            'category_id' => $categories->first()->id,
            'price' => 299.99,
            'stock' => 25,
            'sku' => 'SW5-002',
            'image' => null,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Gaming Mouse RGB',
            'slug' => 'gaming-mouse-rgb',
            'description' => 'Professional gaming mouse with customizable RGB lighting',
            'category_id' => $categories->first()->id,
            'price' => 49.99,
            'stock' => 100,
            'sku' => 'GMR-003',
            'image' => null,
            'is_active' => true,
        ]);
    }
}
