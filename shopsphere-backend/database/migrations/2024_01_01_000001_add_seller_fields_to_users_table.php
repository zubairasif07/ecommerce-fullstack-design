<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_type')->default('customer')->after('email'); // 'customer' or 'seller'
            $table->string('phone')->nullable()->after('user_type');
            $table->string('business_license')->nullable()->after('phone');
            $table->string('tax_identification')->nullable()->after('business_license');
            $table->string('bank_account_holder_name')->nullable()->after('tax_identification');
            $table->string('bank_account_number')->nullable()->after('bank_account_holder_name');
            $table->string('bank_routing_number')->nullable()->after('bank_account_number');
            $table->string('store_name')->nullable()->after('bank_routing_number');
            $table->string('store_category')->nullable()->after('store_name');
            $table->text('address')->nullable()->after('store_category');
            $table->boolean('is_seller_verified')->default(false)->after('address');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_type',
                'phone',
                'business_license',
                'tax_identification',
                'bank_account_holder_name',
                'bank_account_number',
                'bank_routing_number',
                'store_name',
                'store_category',
                'address',
                'is_seller_verified'
            ]);
        });
    }
};
