import { useState } from "react";
import { Link } from "react-router-dom";

const SellerProducts = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", price: 99.99, stock: 45, sold: 124, status: "Active" },
    { id: 2, name: "USB-C Cable Bundle", sku: "UC-002", category: "Electronics", price: 19.99, stock: 120, sold: 89, status: "Active" },
    { id: 3, name: "Phone Stand", sku: "PS-003", category: "Gadgets", price: 24.99, stock: 78, sold: 67, status: "Active" },
    { id: 4, name: "Portable Charger", sku: "PC-004", category: "Electronics", price: 49.99, stock: 32, sold: 45, status: "Active" },
    { id: 5, name: "Laptop Stand", sku: "LS-005", category: "Home", price: 149.99, stock: 15, sold: 22, status: "Active" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");

  const filteredProducts = filterStatus === "All" ? products : products.filter((p) => p.status === filterStatus);

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Manage Products</h1>
            <p className="text-slate-600">You have {products.length} products listed</p>
          </div>
          <Link
            to="/seller/add-product"
            className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            + Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 mb-6 flex gap-3">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Product Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-red-600">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 50
                          ? "bg-green-100 text-green-700"
                          : product.stock > 20
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{product.sold}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 font-semibold hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SellerProducts;

