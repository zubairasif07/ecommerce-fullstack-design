# ShopSphere - Backend & Frontend Setup Guide

## 🎉 Setup Complete!

Both the backend and frontend are now up and running and connected.

### 📍 Running Servers

**Backend (Laravel API):**
- URL: `http://127.0.0.1:8000`
- Port: `8000`
- Database: `shopsphere_db`

**Frontend (React with Vite):**
- URL: `http://localhost:5174`
- Port: `5174`

---

## 📚 Available API Endpoints

### Public Endpoints (No Authentication Required)

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/{slug}` - Get category details
- `GET /api/categories/{slug}/products` - Get products in a category

#### Products
- `GET /api/products` - List all active products (paginated)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/search/{query}` - Search products

### Protected Endpoints (Requires Authentication)

#### User
- `GET /api/user` - Get current user info (requires Sanctum token)

#### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
  - Body: `{ "product_id": 1, "quantity": 1 }`
- `PUT /api/cart/{itemId}` - Update cart item quantity
  - Body: `{ "quantity": 2 }`
- `DELETE /api/cart/{itemId}` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

---

## 🗄️ Database Schema

### Tables Created

#### Categories
- `id` - Primary Key
- `name` - Category name
- `slug` - URL-friendly identifier
- `description` - Category description
- `image` - Category image URL
- `timestamps` - Created/Updated times

#### Products
- `id` - Primary Key
- `category_id` - Foreign Key to Categories
- `name` - Product name
- `slug` - URL-friendly identifier
- `description` - Product description
- `price` - Product price (decimal)
- `stock` - Available quantity
- `image` - Product image URL
- `is_active` - Product visibility flag
- `timestamps` - Created/Updated times

#### Cart Items
- `id` - Primary Key
- `user_id` - Foreign Key to Users
- `product_id` - Foreign Key to Products
- `quantity` - Item quantity
- `timestamps` - Created/Updated times

---

## 🌱 Sample Data

The database has been seeded with sample data:

### Categories
1. **Electronics** - Electronic devices and gadgets
2. **Clothing** - Apparel and fashion items
3. **Books** - Various books and publications

### Products
- Wireless Headphones ($99.99)
- USB-C Cable ($9.99)
- Cotton T-Shirt ($19.99)
- Jeans ($49.99)
- The Great Gatsby ($12.99)
- To Kill a Mockingbird ($14.99)

---

## 🔌 Frontend Configuration

The frontend is configured to communicate with the backend via the `VITE_API_URL` environment variable.

**File:** `.env.local`
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📦 Project Structure

### Backend (Laravel)
```
shopsphere-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── CategoryController.php
│   │   │   ├── ProductController.php
│   │   │   └── CartController.php
│   │   └── Kernel.php
│   └── Models/
│       ├── Category.php
│       ├── Product.php
│       └── CartItem.php
├── database/
│   ├── migrations/
│   │   ├── 2024_03_24_000001_create_categories_table.php
│   │   ├── 2024_03_24_000002_create_products_table.php
│   │   └── 2024_03_24_000003_create_cart_items_table.php
│   └── seeders/
│       ├── ProductSeeder.php
│       └── DatabaseSeeder.php
├── routes/
│   └── api.php
└── .env (configured with DB credentials)
```

### Frontend (React + TypeScript)
```
shopsphere-frontend/
├── src/
│   ├── services/
│   │   └── api.ts (API service for backend communication)
│   ├── pages/
│   ├── components/
│   └── App.tsx
├── .env.local (API URL configuration)
└── vite.config.ts
```

---

## 🚀 Quick Start Commands

### Start Backend
```bash
cd shopsphere-backend
php artisan serve --host=127.0.0.1 --port=8000
```

### Start Frontend
```bash
cd shopsphere-frontend
npm run dev
```

### Run Database Migrations
```bash
cd shopsphere-backend
php artisan migrate
```

### Seed Database with Sample Data
```bash
cd shopsphere-backend
php artisan db:seed
```

### Fresh Migration with Seeding
```bash
cd shopsphere-backend
php artisan migrate:fresh --seed
```

---

## 🧪 Testing the Connection

### Using cURL (Category Endpoint)
```bash
curl http://127.0.0.1:8000/api/categories
```

### Using Browser
Navigate to: `http://127.0.0.1:8000/api/products`

### From Frontend
The frontend API service is already configured and ready to use:
```typescript
import api from './services/api';

// Fetch categories
fetchCategories().then(data => console.log(data));

// Fetch products
fetchCategoryProducts('electronics').then(data => console.log(data));
```

---

## 📝 Next Steps

1. **Authentication**: Implement Laravel Sanctum authentication for user login/registration
2. **Orders**: Create orders table and order management API
3. **Payments**: Integrate payment gateway (Stripe, PayPal, etc.)
4. **Frontend Pages**: Build product listing, cart, and checkout pages
5. **Admin Panel**: Create admin dashboard for managing products and categories

---

## 🔐 Security Notes

- CORS is already enabled for API development
- Ensure `.env` file is never committed to version control
- Use HTTPS in production
- Implement proper authentication tokens (Sanctum is configured)
- Validate all API inputs

---

## 📞 Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify PHP is installed and in PATH
- Check `.env` file database credentials

### Frontend won't start
- Check if Node.js is installed
- Run `npm install` to ensure dependencies
- Check if port 5174 is available

### Database connection error
- Verify `shopsphere_db` exists in MySQL
- Check DB credentials in `.env` match your MySQL setup
- Ensure MySQL service is running

### API calls failing
- Check both servers are running
- Verify `VITE_API_URL` in frontend `.env.local`
- Check browser console for CORS errors

---

**Status:** ✅ Ready to develop!
