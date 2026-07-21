// src/pages/ShoppingCart.tsx
import { useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';
import { useCart } from '../hooks/useCart';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, loading } = useCart();
  const navigate = useNavigate();

  const cartTotal = getCartTotal();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />

        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Loading your cart...
              </h2>
              <p className="text-gray-600 mb-6">
                Fetching your saved cart from the database.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start shopping to add products to your cart
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b grid grid-cols-6 gap-4 font-semibold text-gray-700">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                    <div></div>
                  </div>

                  {/* Items */}
                  {cart.map((item) => {
                    const product = item.product ?? {
                      id: item.product_id,
                      category_id: 0,
                      name: 'Unknown product',
                      slug: '',
                      price: 0,
                      stock: 0,
                      is_active: false,
                    };
                    const price = typeof product.price === 'string'
                      ? parseFloat(product.price)
                      : product.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <div
                        key={item.product_id}
                        className="px-6 py-4 border-b grid grid-cols-6 gap-4 items-center hover:bg-gray-50 transition"
                      >
                        {/* Product Image & Name */}
                        <div className="col-span-2 flex gap-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                              No image
                            </div>
                          )}
                          <div>
                            <h3 
                              className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                              onClick={() => navigate(`/product/${item.product_id}`)}
                            >
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-1">
                              {product.description ?? 'No description available.'}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-gray-800 font-semibold">
                          ${price.toFixed(2)}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center border border-gray-300 rounded w-24">
                          <button
                            onClick={async () => {
                              await updateQuantity(item.product_id, item.quantity - 1);
                            }}
                            className="px-2 py-1 hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            aria-label="Quantity"
                            value={item.quantity}
                            onChange={async (e) => {
                              const qty = parseInt(e.target.value) || 1;
                              await updateQuantity(item.product_id, qty);
                            }}
                            className="w-full text-center py-1 border-l border-r"
                          />
                          <button
                            onClick={async () => {
                              await updateQuantity(item.product_id, item.quantity + 1);
                            }}
                            className="px-2 py-1 hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-gray-800 font-bold">
                          ${itemTotal.toFixed(2)}
                        </div>

                        {/* Remove Button */}
                        <div className="text-center">
                          <button
                            onClick={async () => {
                              await removeFromCart(item.product_id);
                            }}
                            className="text-red-600 hover:text-red-800 transition p-2"
                            title="Remove from cart"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clear Cart Button */}
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to clear the entire cart?')) {
                      await clearCart();
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-semibold transition text-sm"
                >
                  Clear Shopping Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow h-fit sticky top-4">
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

                  <div className="border-t border-b space-y-3 py-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax:</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;

