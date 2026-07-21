import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSellerDashboard } from "../services/api";

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  date: string;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
}

const SellerDashboard = () => {
  const [storeData, setStoreData] = useState({
    storeName: "",
    ownerName: "",
    rating: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: "$0.00",
    followers: 0,
    topProducts: [] as TopProduct[],
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchSellerDashboard();
        setStoreData({
          storeName: data.storeName || "Your Store",
          ownerName: data.ownerName || "Seller",
          rating: data.rating || 0,
          totalProducts: data.total_products || data.totalProducts || 0,
          totalOrders: data.total_orders || data.totalOrders || 0,
          pendingOrders: data.pending_orders || data.pendingOrders || 0,
          totalRevenue: data.total_revenue || "$0.00",
          followers: data.followers || 0,
          topProducts: (data.top_products || []).map((item: { id: number; name: string; sales: number }, index: number) => ({
            id: item.id || index,
            name: item.name || "Unknown",
            sales: item.sales || 0,
          })),
        });

        // Populate recent orders with latest to avoid deep API changes.
        setRecentOrders((data.recentOrders || []) as RecentOrder[]);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unable to load dashboard data.";

        // Check if this is a verification error
        if (errorMessage.includes("pending verification") || errorMessage.includes("verified")) {
          setIsVerified(false);
          setError("Your seller account is pending verification. Please wait for admin approval.");
        } else {
          setError(errorMessage);
          setIsVerified(true); // Assume verified if it's a different error
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {isVerified === false ? "Account Verification Pending" : (storeData.storeName || "Seller Dashboard")}
            </h1>
            <p className="text-slate-600">
              {isVerified === false
                ? "Your seller account is being reviewed by our admin team."
                : `Welcome back, ${storeData.ownerName || "Seller"}! 👋`
              }
            </p>
          </div>
          {isVerified !== false && (
            <Link
              to="/seller/products"
              className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              + Add Product
            </Link>
          )}
        </div>

        {error && isVerified !== false && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}

        {loading && (
          <div className="mb-4 p-4 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg">Loading seller dashboard...</div>
        )}

        {/* Verification Pending Screen */}
        {isVerified === false && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Verification in Progress</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Your seller account is currently being reviewed by our admin team. Once approved, you'll receive an email confirmation and gain full access to your seller dashboard.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>What happens next?</strong><br />
                • Our team reviews your submitted information<br />
                • You'll receive an email once approved<br />
                • Full dashboard access will be granted
              </p>
            </div>
            <p className="text-slate-500 text-sm">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        )}

        {/* Verified Seller Dashboard */}
        {isVerified === true && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "📦", label: "Total Products", value: storeData.totalProducts, color: "blue" },
            { icon: "📋", label: "Total Orders", value: storeData.totalOrders, color: "green" },
            { icon: "⏳", label: "Pending Orders", value: storeData.pendingOrders, color: "yellow" },
            { icon: "💰", label: "Total Revenue", value: storeData.totalRevenue, color: "purple" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-slate-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/seller/products"
                  className="block w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition text-center"
                >
                  View Products
                </Link>
                <Link
                  to="/seller/add-product"
                  className="block w-full border border-red-600 text-red-600 font-bold py-2 rounded-lg hover:bg-red-50 transition text-center"
                >
                  Add New Product
                </Link>
                <Link
                  to="/seller/settings"
                  className="block w-full border border-slate-300 text-slate-600 font-bold py-2 rounded-lg hover:bg-slate-50 transition text-center"
                >
                  Store Settings
                </Link>
              </div>
            </div>

            {/* Store Rating */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Store Performance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Seller Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-blue-600">{storeData.rating}</span>
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Store Followers</p>
                  <p className="text-2xl font-bold text-slate-900">{storeData.followers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders & Top Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
                <Link to="/seller/orders" className="text-red-600 font-semibold hover:underline text-sm">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{order.product}</p>
                      <p className="text-sm text-slate-600">{order.customer} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{order.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {storeData.topProducts.length === 0 ? (
                  <p className="text-sm text-slate-600">No top products data available yet.</p>
                ) : (
                  storeData.topProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-600">{product.sales} sales</p>
                      </div>
                      <p className="font-bold text-red-600">{product.sales !== undefined ? `$${product.sales}` : "--"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

