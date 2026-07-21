import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoryProducts } from "../services/api";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category_id?: number;
  slug?: string;
  description?: string;
  stock?: number;
  is_active?: boolean;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState(500);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategoryProducts(category.toLowerCase());
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts(data);
        }
      } catch {
        setError("Unable to load products for this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleAddToCart = async (product: ProductItem) => {
    try {
      await addToCart(
        {
          ...product,
          category_id: product.category_id ?? 0,
          slug: product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-'),
          description: product.description ?? '',
          stock: product.stock ?? 0,
          is_active: product.is_active ?? true,
        } as Product,
        1
      );
      navigate('/checkout');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to add to cart';
      if (message.includes('Please log in')) {
        navigate('/login');
      } else {
        alert(message);
      }
    }
  };

  const filteredProducts = products.filter((p) => p.price <= priceRange);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const label = category || "Products";

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">{label}</h1>
          <p className="text-slate-600">
            Browse all {label} products • {filteredProducts.length} items found
          </p>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">Loading products...</div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 text-red-600 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-fit">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Filters</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Max Price: ${priceRange}</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:scale-105 transition"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 line-clamp-2">{product.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-black text-red-600">${product.price}</span>
                          <span className="text-sm text-yellow-500">⭐ {product.rating}</span>
                        </div>
                        <button
                          className="w-full mt-3 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl shadow-lg border border-slate-200 text-center">
                  <p className="text-slate-600 font-semibold">No products found in this price range.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

