import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "../contexts/AdminContext";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSellers from "./pages/AdminSellers";
import AdminUsers from "./pages/AdminUsers";

const AdminApp = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/sellers"
          element={
            <AdminProtectedRoute>
              <AdminSellers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route path="/*" element={<AdminLogin />} />
      </Routes>
    </AdminProvider>
  );
};

export default AdminApp;
