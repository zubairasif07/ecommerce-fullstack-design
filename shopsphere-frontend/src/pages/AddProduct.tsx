import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct, getAuthToken } from "../services/api";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.stock || !formData.sku || !imageFile) {
      setError("Please fill in all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please log in to add a product.');
        navigate('/seller/login');
        return;
      }

      // Get category ID (for now, we'll use a simple mapping)
      const categoryMapping: Record<string, number> = {
        'Electronics': 1,
        'Fashion': 2,
        'Home': 3,
        'Beauty': 4,
        'Sports': 5,
        'Toys': 6,
        'Grocery': 7,
        'Gadgets': 8,
      };

      const categoryId = categoryMapping[formData.category];
      if (!categoryId) {
        setError('Invalid category selected.');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category_id', categoryId.toString());
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('sku', formData.sku);
      submitData.append('image', imageFile);

      await createProduct(submitData);
      navigate("/seller/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Add New Product</h1>
          <p className="text-slate-600">Fill in the details to list a new product on your store</p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., Wireless Headphones Pro"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 h-24"
                placeholder="Describe your product in detail..."
                required
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="">Select category</option>
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="99.99"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* SKU and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="e.g., WH-2024-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="100"
                  required
                />
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <p className="text-xs text-slate-600 mt-1">Upload a high-quality image (JPEG, PNG, JPG, GIF, SVG - max 2MB)</p>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Product..." : "Add Product"}
              </button>
              <Link
                to="/seller/products"
                className="flex-1 border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-300 p-6 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-3">💡 Tips for Success</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>✓ Use clear, descriptive product names</li>
            <li>✓ Write detailed descriptions to help customers understand your product</li>
            <li>✓ Price competitively - check similar products for reference</li>
            <li>✓ Keep accurate stock quantities to avoid overselling</li>
            <li>✓ Upload high-quality product images (at least 800x800px recommended)</li>
            <li>✓ Supported formats: JPEG, PNG, JPG, GIF, SVG (max 2MB)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

