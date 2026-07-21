<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new seller
     */
    public function registerSeller(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'owner_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'store_name' => 'required|string|max:255',
            'store_category' => 'required|string|max:255',
            'address' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
            'business_license' => 'required|string|max:255',
            'business_registration_number' => 'required|string|max:255',
            'tax_identification' => 'required|string|max:255',
            'bank_account_holder_name' => 'required|string|max:255',
            'bank_account_number' => 'required|string|max:255',
            'bank_routing_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $seller = User::create([
                'name' => $request->owner_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => 'seller',
                'phone' => $request->phone,
                'store_name' => $request->store_name,
                'store_category' => $request->store_category,
                'address' => $request->address,
                'business_license' => $request->business_license,
                'business_registration_number' => $request->business_registration_number,
                'tax_identification' => $request->tax_identification,
                'bank_account_holder_name' => $request->bank_account_holder_name,
                'bank_account_number' => substr($request->bank_account_number, -4), // Store only last 4 digits for security
                'bank_routing_number' => $request->bank_routing_number,
                'is_seller_verified' => false, // Admin approval needed
            ]);

            return response()->json([
                'message' => 'Seller registered successfully! Your account is pending verification. Please wait for admin approval before logging in.',
                'seller' => [
                    'id' => $seller->id,
                    'name' => $seller->name,
                    'email' => $seller->email,
                    'store_name' => $seller->store_name,
                    'user_type' => $seller->user_type,
                    'is_verified' => $seller->is_seller_verified,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Register a new customer
     */
    public function registerCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $customer = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => 'customer',
            ]);

            $token = $customer->createToken('customer-token')->plainTextToken;

            return response()->json([
                'message' => 'Customer registered successfully!',
                'token' => $token,
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'user_type' => $customer->user_type,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Login
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

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Email not registered. Please register first.'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid password'], 401);
        }

        // Prevent unverified sellers from logging in
        if ($user->user_type === 'seller' && !$user->is_seller_verified) {
            return response()->json([
                'error' => 'Seller account pending verification. Please wait for admin approval.'
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'is_verified' => $user->is_seller_verified ?? false,
            ]
        ], 200);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
