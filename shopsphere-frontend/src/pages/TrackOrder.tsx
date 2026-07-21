import { useState } from "react";
import { fetchOrderById } from "../services/api";

interface TrackOrderItem {
  name: string;
  qty: number;
  price: string;
}

interface TrackOrderData {
  id: number;
  date: string;
  total: string;
  status: string;
  items: TrackOrderItem[];
  shipping_address?: string;
  billing_address?: string;
}

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [displayOrder, setDisplayOrder] = useState<TrackOrderData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const id = trackingId.trim();
      if (!id) {
        setErrorMessage('Please enter an order ID.');
        return;
      }

      let lookupId = id;
      const numericSuffix = id.match(/\d+/g)?.join('');
      if (!/^\d+$/.test(id) && numericSuffix) {
        lookupId = numericSuffix;
      }

      const fetchedOrder = await fetchOrderById(lookupId);
      const simplifiedItems = (fetchedOrder.items || []).map((item: { name?: string; product_id?: number; quantity?: number; qty?: number; price?: number | string; }) => ({
        name: item.name || `Product ${item.product_id ?? ""}`,
        qty: item.quantity || item.qty || 1,
        price: `$${Number(item.price || 0).toFixed(2)}`,
      }));

      setDisplayOrder({
        id: fetchedOrder.id,
        date: new Date(fetchedOrder.created_at).toLocaleDateString(),
        total: `$${Number(fetchedOrder.total).toFixed(2)}`,
        status: fetchedOrder.status,
        items: simplifiedItems,
        shipping_address: fetchedOrder.shipping_address,
        billing_address: fetchedOrder.billing_address,
      });
    } catch (error: unknown) {
      setDisplayOrder(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to track order.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in transit":
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const buildTimeline = (status: string) => {
    const steps = [
      { step: "Order Placed", key: "placed" },
      { step: "Processing", key: "processing" },
      { step: "Shipped", key: "shipped" },
      { step: "In Transit", key: "in_transit" },
      { step: "Delivered", key: "delivered" },
    ];

    const current = status.toLowerCase();
    return steps.map((item) => {
      let completed = false;
      if (item.key === "placed") completed = true;
      else if (item.key === "processing" && ["processing", "shipped", "in transit", "delivered"].includes(current)) completed = true;
      else if (item.key === "shipped" && ["shipped", "in transit", "delivered"].includes(current)) completed = true;
      else if (item.key === "in_transit" && ["in transit", "delivered"].includes(current)) completed = true;
      else if (item.key === "delivered" && current === "delivered") completed = true;

      return {
        ...item,
        date: "-",
        completed,
      };
    });
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Track Your Order</h1>
          <p className="text-lg text-slate-600">Enter your order ID to track your shipment</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-2024-001)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Prompt for real order tracking */}
        {!displayOrder && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Track an Existing Order</h2>
            <p className="text-slate-600">
              Enter your order ID from the receipt or order confirmation email. This pulls live data from your account orders.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            Fetching order... please wait.
          </div>
        )}

        {/* Order Details */}
        {displayOrder && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Order {displayOrder.id}</h2>
                  <p className="text-slate-600 mt-1">Order Date: {displayOrder.date}</p>
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-full font-bold text-lg ${getStatusColor(displayOrder.status)}`}>
                    {displayOrder.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Shipment Timeline</h3>
              <div className="space-y-4">
                {buildTimeline(displayOrder.status).map((item, idx) => (
                  <div key={item.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          item.completed
                            ? "bg-red-600 text-white"
                            : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {item.completed ? "✓" : idx + 1}
                      </div>
                      {idx < buildTimeline(displayOrder.status).length - 1 && (
                        <div className={`w-1 h-12 ${item.completed ? "bg-red-600" : "bg-slate-300"}`}></div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-bold text-slate-900">{item.step}</p>
                      <p className="text-sm text-slate-600">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {displayOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-red-600">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                <p className="font-bold text-slate-900">Total:</p>
                <p className="font-bold text-red-600 text-lg">{displayOrder.total}</p>
              </div>
            </div>

            {/* Contact & Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="border border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition">
                  Contact Support
                </button>
                <button className="border border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition">
                  Download Invoice
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setDisplayOrder(null);
                setTrackingId("");
              }}
              className="w-full text-slate-600 font-semibold py-2 rounded-lg hover:text-red-600 transition"
            >
              ← Search Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

