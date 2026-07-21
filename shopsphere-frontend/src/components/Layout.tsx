// src/components/Layout.tsx
import Sidebar from "./Sidebar";
import ProductGrid from "./ProductGrid";

const Layout = () => {
  return (
    <div className="flex gap-4 p-4 bg-gray-100">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1">
        <ProductGrid />
      </div>
    </div>
  );
};

export default Layout;