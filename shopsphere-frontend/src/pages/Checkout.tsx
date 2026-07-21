import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const cartTotal = getCartTotal();
  const shippingPrice = selectedMethod === 'express' ? 15 : 5;
  const tax = Number(((cartTotal + shippingPrice) * 0.08).toFixed(2));
  const finalTotal = Number((cartTotal + shippingPrice + tax).toFixed(2));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!shippingAddress.trim()) {
      setError('Shipping address is required.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const token = localStorage.getItem('shopSphereToken') || '';

    const orderData = {
      shipping_address: shippingAddress,
      billing_address: billingAddress || shippingAddress,
      items: cart.map((item) => {
        const productPrice = item.product?.price ?? 0;
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: typeof productPrice === 'string' ? parseFloat(productPrice) : productPrice,
        };
      }),
    };

    try {
      setIsSubmitting(true);
      await createOrder(token, orderData);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to place order.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <SubNav />
          <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
            <p className="mt-3 text-gray-600">Add items to your cart before checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  id="shippingAddress"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Billing Address (optional)</label>
                <textarea
                  id="billingAddress"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Shipping Method</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shipping" value="standard" checked={selectedMethod === 'standard'} onChange={() => setSelectedMethod('standard')} />
                    Standard Delivery ($5.00, 5-7 days)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shipping" value="express" checked={selectedMethod === 'express'} onChange={() => setSelectedMethod('express')} />
                    Express Delivery ($15.00, 1-2 days)
                  </label>
                </div>
              </div>

              {error && <p className="text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Placing your order...' : `Place Order ($${finalTotal.toFixed(2)})`}
              </button>
            </form>
          </div>

          <aside className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <p className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></p>
              <hr className="my-2" />
              <p className="flex justify-between font-bold text-lg"><span>Total</span><span>${finalTotal.toFixed(2)}</span></p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

