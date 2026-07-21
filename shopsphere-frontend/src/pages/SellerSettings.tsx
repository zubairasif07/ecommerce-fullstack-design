import { useState } from "react";

const SellerSettings = () => {
  const [formData, setFormData] = useState({
    storeName: "TechHub Store",
    ownerName: "John Seller",
    email: "john@techhub.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA",
    description: "Premium electronics and gadgets at unbeatable prices",
    bankAccount: "****1234",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Settings updated successfully!");
    setEditMode(false);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Store Settings</h1>
          <p className="text-slate-600">Manage your store information and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Store Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Store Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-red-600 font-semibold hover:text-red-800 transition"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  ) : (
                    <p className="px-4 py-2 text-slate-900 font-semibold">{formData.storeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Owner Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  ) : (
                    <p className="px-4 py-2 text-slate-900 font-semibold">{formData.ownerName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  ) : (
                    <p className="px-4 py-2 text-slate-900 font-semibold">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  ) : (
                    <p className="px-4 py-2 text-slate-900 font-semibold">{formData.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                ) : (
                  <p className="px-4 py-2 text-slate-900 font-semibold">{formData.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Store Description</label>
                {editMode ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 h-20"
                  />
                ) : (
                  <p className="px-4 py-2 text-slate-900 font-semibold">{formData.description}</p>
                )}
              </div>

              {editMode && (
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Account</label>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-300">
                  <p className="text-slate-900 font-semibold">{formData.bankAccount}</p>
                  <button className="text-red-600 font-semibold hover:text-red-800 transition">Update</button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-300">
                <p className="text-blue-900 font-semibold mb-2">💰 Payout Schedule</p>
                <p className="text-blue-800 text-sm">Your earnings are transferred to your bank account every Friday</p>
              </div>
            </div>
          </div>

          {/* Seller Policies */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Seller Policies</h2>

            <div className="space-y-4">
              {[
                { title: "Return Policy", description: "Allow 30-day returns for all products", status: "Enabled" },
                { title: "Refund Policy", description: "Full refunds processed within 5-7 business days", status: "Enabled" },
                { title: "Shipping Policy", description: "Free shipping on orders over $50", status: "Enabled" },
              ].map((policy, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900">{policy.title}</p>
                    <p className="text-sm text-slate-600">{policy.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 rounded-xl border-2 border-red-300">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <p className="text-red-800 mb-4">These actions cannot be undone. Please proceed with caution.</p>
            <button className="w-full border-2 border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition">
              Close Store Temporarily
            </button>
            <button className="w-full mt-2 border-2 border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition">
              Delete Store Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;

