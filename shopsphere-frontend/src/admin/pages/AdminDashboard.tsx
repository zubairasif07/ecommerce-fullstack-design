import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface DashboardStats {
  total_sellers: number;
  verified_sellers: number;
  pending_sellers: number;
  total_users: number;
  total_orders: number;
  total_products: number;
}

const AdminDashboard = () => {
  const { admin, token, logout } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setStats(data.stats);
        } else {
          setError(data.error || "Failed to fetch stats");
        }
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ShopSphere" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-3xl font-black text-white">
                <span className="text-red-600">Shop</span>
                <span className="text-white">Sphere</span> Admin
              </h1>
              <p className="text-red-100 text-sm">Welcome, {admin?.name}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sellers Card */}
          <Link
            to="/admin/sellers"
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">Total Sellers</p>
                <h3 className="text-4xl font-black">{stats?.total_sellers || 0}</h3>
                <p className="text-blue-100 text-xs mt-2">
                  ✓ Verified: {stats?.verified_sellers || 0}
                </p>
                <p className="text-yellow-200 text-xs">⏳ Pending: {stats?.pending_sellers || 0}</p>
              </div>
              <div className="text-5xl opacity-20">👨‍💼</div>
            </div>
          </Link>

          {/* Users Card */}
          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-2">Total Buyers</p>
                <h3 className="text-4xl font-black">{stats?.total_users || 0}</h3>
                <p className="text-green-100 text-xs mt-2">Active customers</p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </Link>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-2">Total Orders</p>
                <h3 className="text-4xl font-black">{stats?.total_orders || 0}</h3>
                <p className="text-purple-100 text-xs mt-2">Platform orders</p>
              </div>
              <div className="text-5xl opacity-20">📦</div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-2">Total Products</p>
                <h3 className="text-4xl font-black">{stats?.total_products || 0}</h3>
                <p className="text-orange-100 text-xs mt-2">Listed products</p>
              </div>
              <div className="text-5xl opacity-20">🛍️</div>
            </div>
          </div>

          {/* Verified Sellers Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-2">Verified Sellers</p>
                <h3 className="text-4xl font-black">{stats?.verified_sellers || 0}</h3>
                <p className="text-emerald-100 text-xs mt-2">
                  {stats ? ((stats.verified_sellers / stats.total_sellers) * 100).toFixed(1) : 0}% verified
                </p>
              </div>
              <div className="text-5xl opacity-20">✓</div>
            </div>
          </div>

          {/* Pending Sellers Card */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-100 text-sm font-semibold mb-2">Pending Verification</p>
                <h3 className="text-4xl font-black">{stats?.pending_sellers || 0}</h3>
                <p className="text-amber-100 text-xs mt-2">Awaiting review</p>
              </div>
              <div className="text-5xl opacity-20">⏳</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/sellers"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition"
              >
                👨‍💼 Manage Sellers
              </Link>
              <Link
                to="/admin/users"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition"
              >
                👥 Manage Buyers
              </Link>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Admin Profile</h3>
            <div className="space-y-3 text-slate-300 text-sm">
              <div>
                <p className="text-slate-400">Name</p>
                <p className="text-white font-semibold">{admin?.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="text-white font-semibold">{admin?.email}</p>
              </div>
              <div>
                <p className="text-slate-400">Role</p>
                <p className="text-white font-semibold uppercase">{admin?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
