import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  total: number;
  shipping_address: string;
  billing_address: string;
  items: OrderItem[];
  created_at: string;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('shopSphereToken') || '';
      try {
        const res = await fetch('http://127.0.0.1:8000/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data);
      } catch {
        setError('Unable to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
          {loading && <p>Loading orders...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {orders.length === 0 && !loading && <p>No orders found.</p>}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">Order #{order.id} · {new Date(order.created_at).toLocaleString()}</p>
                <p className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</p>
                <p>Status: <span className="font-bold">{order.status}</span></p>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="text-blue-600 hover:text-blue-800 font-semibold mt-2"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;

