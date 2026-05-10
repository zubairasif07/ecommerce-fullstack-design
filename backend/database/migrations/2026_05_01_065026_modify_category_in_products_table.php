<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('products', 'category_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->unsignedBigInteger('category_id')->nullable()->after('category');
            });
        }

        $products = DB::table('products')->get();
        foreach ($products as $product) {
            if (!empty($product->category)) {
                $category = DB::table('categories')->where('name', $product->category)->first();
                if (!$category) {
                    $catId = DB::table('categories')->insertGetId(['name' => $product->category, 'created_at' => now(), 'updated_at' => now()]);
                } else {
                    $catId = $category->id;
                }
                DB::table('products')->where('id', $product->id)->update(['category_id' => $catId]);
            }
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('category')->nullable();
        });

        $products = DB::table('products')->get();
        foreach ($products as $product) {
            if ($product->category_id) {
                $category = DB::table('categories')->where('id', $product->category_id)->first();
                if ($category) {
                    DB::table('products')->where('id', $product->id)->update(['category' => $category->name]);
                }
            }
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('category_id');
        });
    }
};
