import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { userRegister } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await userRegister(formData.fullName, formData.email, formData.password, formData.confirmPassword);
      localStorage.setItem("shopSphereToken", res.token);
      navigate("/");
    } catch {
      setError("Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response: { token: string }) => {
    localStorage.setItem("shopSphereToken", response.token);
    navigate("/");
  };

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Create Your ShopSphere Account</h1>
            <p className="text-lg text-slate-600 mb-6">Join millions of shoppers. Get exclusive deals, fast delivery, and 24/7 customer support.</p>

            <ul className="space-y-3">
              {[
                "✅ Free shipping on orders over $50",
                "✅ Exclusive member-only deals",
                "✅ Easy returns and refunds",
                "✅ Secure payment options",
                "✅ Track your orders in real-time",
              ].map((item, idx) => (
                <li key={idx} className="text-slate-700 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Register Now</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

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
                userType="user"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600 font-semibold hover:underline">
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

export default Register;

