import { useEffect, useState } from "react";
import { fetchCart, removeCartItem, updateCartItem } from "../services/api";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("shopSphereToken") || "";

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart(token);
        setCartItems(data.items ?? []);
      } catch {
        setError("Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token]);

  const handleRemove = async (itemId: number) => {
    try {
      await removeCartItem(itemId, token);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch {
      setError("Unable to remove item.");
    }
  };

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(itemId, quantity, token);
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    } catch {
      setError("Unable to update quantity.");
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {loading ? (
          <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg">
            <p className="text-lg font-semibold">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded-md"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="block text-xs text-red-600 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              ))}
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="mt-5 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

