# Google OAuth Setup Guide

This document explains how to set up Google OAuth authentication for ShopSphere (both User and Seller sign-in/registration).

## Prerequisites

- Google Cloud Project
- OAuth 2.0 Client ID credentials

## Step 1: Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5174` (for local development)
     - `http://localhost:3000` (if using different port)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Copy the **Client ID** (you'll need this)

## Step 2: Configure Frontend

1. Update `.env.local` in `shopsphere-frontend/`:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
   ```
   Replace `YOUR_ACTUAL_CLIENT_ID_HERE` with your Client ID from Step 1.

2. The frontend is already set up with:
   - `GoogleOAuthButton` component in `src/components/`
   - All 4 auth pages (Login, Register, SellerLogin, SellerSignup) have the button integrated
   - OAuth functions in `src/services/api.ts`

## Step 3: Set Up Backend (Laravel)

You need to create API endpoints to handle Google token verification and user creation/authentication.

### Add to `routes/api.php`:

```php
Route::post('/auth/google/login', [AuthController::class, 'googleLogin']);
Route::post('/auth/google/register', [AuthController::class, 'googleRegister']);
```

### Create `AuthController` method:

```php
use Google_Client;

public function googleLogin(Request $request)
{
    $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
    $payload = $client->verifyIdToken($request->input('token'));
    
    if (!$payload) {
        return response()->json(['message' => 'Invalid token'], 401);
    }
    
    $user = User::firstOrCreate(
        ['email' => $payload['email']],
        [
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => bcrypt(Str::random(24)),
        ]
    );
    
    $token = $user->createToken('google-auth')->plainTextToken;
    
    return response()->json(['token' => $token, 'user' => $user]);
}

public function googleRegister(Request $request)
{
    // Similar to googleLogin, with additional seller-specific logic if needed
    return $this->googleLogin($request);
}
```

### Install Google Client Library:

```bash
cd shopsphere-backend
composer require google/apiclient
```

### Add to `.env`:

```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## Step 4: Test the Integration

1. Start backend:
   ```bash
   cd shopsphere-backend
   php artisan serve
   ```

2. Start frontend:
   ```bash
   cd shopsphere-frontend
   npm run dev
   ```

3. Navigate to any auth page:
   - User Login: `http://localhost:5174/login`
   - User Register: `http://localhost:5174/register`
   - Seller Login: `http://localhost:5174/seller/login`
   - Seller Register: `http://localhost:5174/seller/signup`

4. Click "Continue with Google" button
5. Choose your Google account
6. You should be authenticated and redirected to the dashboard

## Features Implemented

### User Authentication
- **Login Page** (`/login`): Traditional email/password + Google OAuth
- **Register Page** (`/register`): Create account with email/password or Google OAuth

### Seller Authentication
- **Seller Login** (`/seller/login`): Store email/password + Google OAuth
- **Seller Signup** (`/seller/signup`): Create seller account with form + Google OAuth

### Token Storage
- User tokens saved to `localStorage.shopSphereToken`
- Seller tokens saved to `localStorage.shopSphereSellerToken`

## File Changes

### Frontend Files Created/Modified:
- `src/components/GoogleOAuthButton.tsx` - Reusable OAuth button component
- `src/pages/Login.tsx` - Added OAuth support
- `src/pages/Register.tsx` - Added OAuth support
- `src/pages/SellerLogin.tsx` - Added OAuth support
- `src/pages/SellerSignup.tsx` - Added OAuth support
- `src/main.tsx` - Wrapped app with GoogleOAuthProvider
- `src/services/api.ts` - Added OAuth functions
- `.env.local` - Added VITE_GOOGLE_CLIENT_ID

### Backend Files to Create/Modify:
- `app/Http/Controllers/AuthController.php` - Add OAuth methods
- `routes/api.php` - Add OAuth routes
- `.env` - Add GOOGLE_CLIENT_ID

## Troubleshooting

### "Continue with Google" button doesn't work
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly in `.env.local`
- Verify the Client ID is valid in Google Cloud Console
- Ensure redirect URIs are configured correctly

### CORS errors
- Add Google OAuth endpoints to CORS allowed origins in backend config

### Token verification fails
- Ensure backend has correct `GOOGLE_CLIENT_ID` in `.env`
- Verify `google/apiclient` package is installed
- Check token expiration time

## Next Steps

- Implement password reset with Google
- Add social linking (link Google account to existing account)
- Implement logout functionality
- Add user profile picture from Google
