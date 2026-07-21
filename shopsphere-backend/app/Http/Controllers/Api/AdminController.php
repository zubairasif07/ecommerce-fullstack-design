<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SellerVerified;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Admin Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$admin->is_active) {
            return response()->json(['error' => 'Admin account is inactive'], 403);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ]
        ], 200);
    }

    /**
     * Get Admin Profile
     */
    public function profile(Request $request)
    {
        $admin = $request->user('sanctum');

        return response()->json([
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'is_active' => $admin->is_active,
            ]
        ], 200);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    /**
     * Get All Sellers
     */
    public function getSellers(Request $request)
    {
        $sellers = User::where('user_type', 'seller')
            ->select('id', 'name', 'email', 'phone', 'store_name', 'store_category', 'is_seller_verified', 'created_at')
            ->paginate(15);

        return response()->json([
            'sellers' => $sellers->items(),
            'total' => $sellers->total(),
            'per_page' => $sellers->perPage(),
            'current_page' => $sellers->currentPage(),
            'last_page' => $sellers->lastPage(),
        ], 200);
    }

    /**
     * Get Seller Details
     */
    public function getSellerDetails($id)
    {
        $seller = User::where('id', $id)
            ->where('user_type', 'seller')
            ->select('id', 'name', 'email', 'phone', 'store_name', 'store_category', 'address', 'business_license', 'business_registration_number', 'tax_identification', 'bank_account_holder_name', 'bank_routing_number', 'is_seller_verified', 'created_at')
            ->first();

        if (!$seller) {
            return response()->json(['error' => 'Seller not found'], 404);
        }

        return response()->json(['seller' => $seller], 200);
    }

    /**
     * Verify Seller Account
     */
    public function verifySeller(Request $request, $id)
    {
        $seller = User::where('id', $id)->where('user_type', 'seller')->first();

        if (!$seller) {
            return response()->json(['error' => 'Seller not found'], 404);
        }

        $seller->update(['is_seller_verified' => true]);

        // Send verification email
        $emailSent = false;
        try {
            Mail::to($seller->email)->send(new SellerVerified($seller));
            $emailSent = true;
        } catch (\Exception $e) {
            // Log the error but don't fail the verification
            \Log::error('Failed to send seller verification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Seller verified successfully' . ($emailSent ? ' and verification email sent.' : ', but email sending failed.'),
            'seller' => $seller,
            'email_sent' => $emailSent
        ], 200);
    }

    /**
     * Reject Seller Account
     */
    public function rejectSeller(Request $request, $id)
    {
        $seller = User::where('id', $id)->where('user_type', 'seller')->first();

        if (!$seller) {
            return response()->json(['error' => 'Seller not found'], 404);
        }

        $seller->delete();

        return response()->json(['message' => 'Seller account rejected and deleted'], 200);
    }

    /**
     * Get All Buyers/Users
     */
    public function getUsers(Request $request)
    {
        $users = User::where('user_type', 'customer')
            ->select('id', 'name', 'email', 'phone', 'created_at')
            ->paginate(15);

        return response()->json([
            'users' => $users->items(),
            'total' => $users->total(),
            'per_page' => $users->perPage(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ], 200);
    }

    /**
     * Get User Details with Orders
     */
    public function getUserDetails($id)
    {
        $user = User::where('id', $id)
            ->where('user_type', 'customer')
            ->select('id', 'name', 'email', 'phone', 'created_at')
            ->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $orders = $user->orders()->count();

        return response()->json([
            'user' => $user,
            'total_orders' => $orders
        ], 200);
    }

    /**
     * Dashboard Statistics
     */
    public function getDashboardStats()
    {
        $totalSellers = User::where('user_type', 'seller')->count();
        $verifiedSellers = User::where('user_type', 'seller')->where('is_seller_verified', true)->count();
        $pendingSellers = User::where('user_type', 'seller')->where('is_seller_verified', false)->count();
        $totalUsers = User::where('user_type', 'customer')->count();
        $totalOrders = \App\Models\Order::count();
        $totalProducts = \App\Models\Product::count();

        return response()->json([
            'stats' => [
                'total_sellers' => $totalSellers,
                'verified_sellers' => $verifiedSellers,
                'pending_sellers' => $pendingSellers,
                'total_users' => $totalUsers,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
            ]
        ], 200);
    }
}
