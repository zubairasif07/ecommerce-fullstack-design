import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface UserDetails {
  user: User;
  total_orders: number;
}

const AdminUsers = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch {
      setError("Failed to load users data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchUsers();
  }, [token, navigate, fetchUsers]);

  const viewUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedUser(data);
        setShowModal(true);
      } else {
        setError(data.error || "Failed to fetch user details");
      }
    } catch {
      setError("Failed to load user details");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Buyers Management</h1>
            <p className="text-red-100 text-sm">Manage buyer/customer accounts</p>
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

        {/* Users Summary */}
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Buyers</p>
              <p className="text-3xl font-black text-white">{users.length}</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-600">
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No buyers found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 text-white font-semibold">{user.name}</td>
                    <td className="px-6 py-4 text-slate-300">{user.email}</td>
                    <td className="px-6 py-4 text-slate-300">{user.phone || "-"}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewUserDetails(user.id)}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full border border-slate-700">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedUser.user.name}</h3>
                  <p className="text-green-100 text-sm">Buyer Account Details</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-green-100 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{selectedUser.user.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{selectedUser.user.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Phone</p>
                    <p className="text-white font-semibold">{selectedUser.user.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Member Since</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedUser.user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Activity</h4>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Total Orders</span>
                    <span className="text-2xl font-black text-green-400">{selectedUser.total_orders}</span>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Account Status</h4>
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <p className="text-green-300 font-semibold">✓ Active</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-700 px-6 py-4 flex gap-3 border-t border-slate-600">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
