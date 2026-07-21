import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleOAuthButton from "../components/GoogleOAuthButton";

const SellerSignup = () => {
  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeCategory: "",
    address: "",
    businessLicense: "",
    businessRegistrationNumber: "",
    taxIdentification: "",
    idCardFront: null as File | null,
    idCardBack: null as File | null,
    bankAccountHolderName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'file') {
      setFormData({
        ...formData,
        [target.name]: target.files ? target.files[0] : null,
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.ownerName.trim()) {
      setError("Owner name is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.storeName.trim()) {
      setError("Store name is required");
      return false;
    }
    if (!formData.storeCategory) {
      setError("Store category is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Store address is required");
      return false;
    }
    if (!formData.businessLicense.trim()) {
      setError("Business license is required");
      return false;
    }
    if (!formData.businessRegistrationNumber.trim()) {
      setError("Business registration number is required");
      return false;
    }
    if (!formData.taxIdentification.trim()) {
      setError("Tax identification number is required");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.idCardFront) {
      setError("ID card front picture is required");
      return false;
    }
    if (!formData.idCardBack) {
      setError("ID card back picture is required");
      return false;
    }
    if (formData.idCardFront.size > 5242880) {
      setError("ID card front picture must be less than 5MB");
      return false;
    }
    if (formData.idCardBack.size > 5242880) {
      setError("ID card back picture must be less than 5MB");
      return false;
    }
    if (!formData.bankAccountHolderName.trim()) {
      setError("Bank account holder name is required");
      return false;
    }
    if (!formData.bankAccountNumber.trim()) {
      setError("Bank account number is required");
      return false;
    }
    if (formData.bankAccountNumber.length < 8) {
      setError("Bank account number must be at least 8 digits");
      return false;
    }
    if (!formData.bankRoutingNumber.trim()) {
      setError("Bank routing number is required");
      return false;
    }
    if (formData.bankRoutingNumber.length < 8) {
      setError("Bank routing number must be at least 8 digits");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('owner_name', formData.ownerName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.confirmPassword);
      formDataToSend.append('store_name', formData.storeName);
      formDataToSend.append('store_category', formData.storeCategory);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('business_license', formData.businessLicense);
      formDataToSend.append('business_registration_number', formData.businessRegistrationNumber);
      formDataToSend.append('tax_identification', formData.taxIdentification);
      if (formData.idCardFront) formDataToSend.append('id_card_front', formData.idCardFront);
      if (formData.idCardBack) formDataToSend.append('id_card_back', formData.idCardBack);
      formDataToSend.append('bank_account_holder_name', formData.bankAccountHolderName);
      formDataToSend.append('bank_account_number', formData.bankAccountNumber);
      formDataToSend.append('bank_routing_number', formData.bankRoutingNumber);

      const res = await fetch("http://127.0.0.1:8000/api/auth/register-seller", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw { response: { data: errData } };
      }

      const successData = await res.json();
      // Do not auto-login unverified sellers; admin must approve first.
      localStorage.removeItem("shopSphereSellerToken");
      alert(successData.message || "Registration successful. Your account is pending verification.");
      navigate("/seller/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, unknown>; error?: string } } };
      setError(error.response?.data?.errors ? Object.values(error.response.data.errors).join(", ") : error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response: { token: string }) => {
    localStorage.setItem("shopSphereToken", response.token);
    localStorage.setItem("shopSphereSellerToken", response.token);
    navigate("/seller/dashboard");
  };

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="text-red-600 font-medium mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Info & Progress */}
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Become a ShopSphere Seller</h1>
            <p className="text-lg text-slate-600 mb-6">
              Reach millions of customers and grow your business with ShopSphere's seller platform.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "✅ Zero commission on first 100 sales",
                "✅ Easy product listing and management",
                "✅ Real-time order and inventory tracking",
                "✅ Secure payment processing",
                "✅ Seller analytics and insights",
                "✅ 24/7 seller support",
              ].map((item, idx) => (
                <li key={idx} className="text-slate-700 font-medium">
                  {item}
                </li>
              ))}
            </ul>

            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-800 mb-3">
                <span className="font-bold block mb-2">📋 Requirements (MANDATORY):</span>
              </p>
              <ul className="text-sm text-red-700 space-y-2 list-disc list-inside">
                <li>ID card front and back pictures</li>
                <li>Bank account details</li>
              </ul>
              <p className="text-xs text-red-700 mt-3">
                ⚠️ Your account will be verified by our team before going live.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= 1 ? "bg-red-600" : "bg-slate-300"}`}>
                  1
                </div>
                <span className={`ml-3 ${step >= 1 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>Account Info</span>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= 2 ? "bg-red-600" : "bg-slate-300"}`}>
                  2
                </div>
                <span className={`ml-3 ${step >= 2 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>Store Details</span>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= 3 ? "bg-red-600" : "bg-slate-300"}`}>
                  3
                </div>
                <span className={`ml-3 ${step >= 3 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>ID & Bank Details</span>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Register as Seller - Step {step} of 3</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Account Information */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="email@store.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Min 6 characters"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Store Information */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="e.g., TechHub Store"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Store Category *</label>
                    <select
                      name="storeCategory"
                      value={formData.storeCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home & Garden</option>
                      <option value="Beauty">Beauty & Personal Care</option>
                      <option value="Sports">Sports & Outdoors</option>
                      <option value="Toys">Toys & Games</option>
                      <option value="Grocery">Grocery & Food</option>
                      <option value="Gadgets">Gadgets & Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Store Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="123 Business Street, City, State"
                      required
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Business Information *</p>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Business License Number *</label>
                      <input
                        type="text"
                        name="businessLicense"
                        value={formData.businessLicense}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Enter your business license number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Business Registration Number *</label>
                      <input
                        type="text"
                        name="businessRegistrationNumber"
                        value={formData.businessRegistrationNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Enter your business registration number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Identification Number *</label>
                      <input
                        type="text"
                        name="taxIdentification"
                        value={formData.taxIdentification}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Enter your tax ID number"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: ID Card & Bank Details */}
              {step === 3 && (
                <>
                  <div className="p-4 bg-slate-100 rounded-lg mb-4">
                    <p className="text-sm text-slate-700 font-semibold mb-2">📸 ID Card Verification</p>
                    <p className="text-xs text-slate-600">Please upload clear pictures of both sides of your ID card for verification purposes.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">ID Card Front Picture *</label>
                      <input
                        type="file"
                        name="idCardFront"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 file:bg-red-600 file:text-white file:font-semibold file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                        required
                      />
                      {formData.idCardFront && <p className="text-xs text-green-600 mt-1">✓ {formData.idCardFront.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">ID Card Back Picture *</label>
                      <input
                        type="file"
                        name="idCardBack"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 file:bg-red-600 file:text-white file:font-semibold file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                        required
                      />
                      {formData.idCardBack && <p className="text-xs text-green-600 mt-1">✓ {formData.idCardBack.name}</p>}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Bank Account Details *</p>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Account Holder Name *</label>
                      <input
                        type="text"
                        name="bankAccountHolderName"
                        value={formData.bankAccountHolderName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Name on bank account"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">Account Number *</label>
                      <input
                        type="password"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="•••••••••••••••"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">Only last 4 digits will be stored for security</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">Routing Number *</label>
                      <input
                        type="text"
                        name="bankRoutingNumber"
                        value={formData.bankRoutingNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="e.g., 021000021"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
                    <p className="text-xs text-blue-700">
                      🔒 Your bank details are encrypted using AES-256 encryption. We comply with PCI DSS standards.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 bg-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-300 transition"
                  >
                    ← Previous
                  </button>
                )}

                {step < 3 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition ${step === 1 ? "w-full" : ""}`}
                  >
                    Next →
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Complete Registration"}
                  </button>
                )}
              </div>

              {step === 1 && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-600">OR</span>
                    </div>
                  </div>

                  <GoogleOAuthButton
                    mode="register"
                    userType="seller"
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </>
              )}

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600">
                  Already a seller?{" "}
                  <Link to="/seller/login" className="text-red-600 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;

