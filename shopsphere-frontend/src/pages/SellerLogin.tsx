import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { userLogin } from "../services/api";

const SellerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);
    setError(null);

    try {
      const data = await userLogin(formData.email, formData.password);
      localStorage.setItem("shopSphereToken", data.token);
      localStorage.setItem("shopSphereSellerToken", data.token);
      alert(data.message);
      navigate("/seller/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      if (message.includes("pending verification")) {
        // Keep unverified sellers on login page and show message
        localStorage.removeItem("shopSphereToken");
        localStorage.removeItem("shopSphereSellerToken");
      }
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
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign In to Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Store Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="seller@store.com"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-slate-700">Remember me</span>
                </label>
                <a href="#" className="text-red-600 font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
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
                mode="login"
                userType="seller"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600">
                  Don't have a seller account?{" "}
                  <Link to="/seller/signup" className="text-red-600 font-semibold hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SellerLogin;

