import { useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />
        <div className="p-12 text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. Your order is being processed and we will send updates by email.</p>
          <button onClick={() => navigate('/orders')} className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3">View Orders</button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

