import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  store_name: string;
  store_category: string;
  is_seller_verified: boolean;
  created_at: string;
}

interface SellerDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  store_name: string;
  store_category: string;
  address: string;
  business_license: string;  business_registration_number: string;  tax_identification: string;
  bank_account_holder_name: string;
  bank_routing_number: string;
  is_seller_verified: boolean;
}

const AdminSellers = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<SellerDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/sellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSellers(data.sellers);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch sellers");
      }
    } catch {
      setError("Failed to load sellers data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchSellers();
  }, [token, navigate, fetchSellers]);

  const viewSellerDetails = async (sellerId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedSeller(data.seller);
        setShowModal(true);
      } else {
        setError(data.error || "Failed to fetch seller details");
      }
    } catch {
      setError("Failed to load seller details");
    }
  };

  const verifySeller = async () => {
    if (!selectedSeller) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${selectedSeller.id}/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Seller verified successfully!");
        setShowModal(false);
        fetchSellers();
      } else {
        setError(data.error || "Failed to verify seller");
      }
    } catch {
      setError("Failed to verify seller");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectSeller = async () => {
    if (!selectedSeller) return;

    if (!window.confirm("Are you sure you want to reject this seller? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${selectedSeller.id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Seller account rejected and deleted");
        setShowModal(false);
        fetchSellers();
      } else {
        setError(data.error || "Failed to reject seller");
      }
    } catch {
      setError("Failed to reject seller");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading sellers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Sellers Management</h1>
            <p className="text-red-100 text-sm">Manage and verify seller accounts</p>
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

        {/* Sellers Table */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-600">
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Store Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No sellers found
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 text-white font-semibold">{seller.store_name}</td>
                    <td className="px-6 py-4 text-slate-300">{seller.name}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{seller.email}</td>
                    <td className="px-6 py-4 text-slate-300">{seller.store_category}</td>
                    <td className="px-6 py-4">
                      {seller.is_seller_verified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-200 rounded-full text-xs font-semibold border border-green-700">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-900/30 text-yellow-200 rounded-full text-xs font-semibold border border-yellow-700">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewSellerDetails(seller.id)}
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
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedSeller.store_name}</h3>
                  <p className="text-blue-100 text-sm">Seller Verification Details</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-blue-100 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{selectedSeller.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Phone</p>
                    <p className="text-white font-semibold">{selectedSeller.phone}</p>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Store Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Store Name</p>
                    <p className="text-white font-semibold">{selectedSeller.store_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Category</p>
                    <p className="text-white font-semibold">{selectedSeller.store_category}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 text-sm">Address</p>
                    <p className="text-white font-semibold">{selectedSeller.address}</p>
                  </div>
                </div>
              </div>

              {/* Business Credentials */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Business Credentials</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Business License</p>
                    <p className="text-white font-semibold bg-slate-700 p-3 rounded break-all">
                      {selectedSeller.business_license}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Business Registration Number</p>
                    <p className="text-white font-semibold bg-slate-700 p-3 rounded break-all">
                      {selectedSeller.business_registration_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Tax Identification</p>
                    <p className="text-white font-semibold bg-slate-700 p-3 rounded break-all">
                      {selectedSeller.tax_identification}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Account (Masked) */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Bank Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Account Holder</p>
                    <p className="text-white font-semibold">{selectedSeller.bank_account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Routing Number</p>
                    <p className="text-white font-semibold">{selectedSeller.bank_routing_number}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-3">
                  ℹ️ Account number is masked for security. Only last 4 digits are stored.
                </p>
              </div>

              {/* Status */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Verification Status</h4>
                <div className="p-4 bg-slate-700 rounded-lg">
                  {selectedSeller.is_seller_verified ? (
                    <p className="text-green-300 font-semibold">✓ This seller is verified and can sell on the platform</p>
                  ) : (
                    <p className="text-yellow-300 font-semibold">⏳ This seller is pending verification</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-700 px-6 py-4 flex gap-3 sticky bottom-0 border-t border-slate-600">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
              {!selectedSeller.is_seller_verified && (
                <>
                  <button
                    onClick={verifySeller}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {actionLoading ? "Processing..." : "✓ Verify Seller"}
                  </button>
                  <button
                    onClick={rejectSeller}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {actionLoading ? "Processing..." : "✕ Reject Seller"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;
