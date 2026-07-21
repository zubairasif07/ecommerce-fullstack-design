import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import type { Product } from '../types';

const DealsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const activeProducts = Array.isArray(data) ? data.filter((product) => product.is_active) : [];
        setProducts(activeProducts.slice(0, 8));
      } catch {
        setError('Unable to load hot deals.');
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  return (
    <section className="bg-white mx-4 md:mx-6 mt-6 p-5 rounded-xl shadow border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-slate-900">Hot Deals</h2>
        <div className="text-xs text-slate-500">01 Days : 17 hrs : 25 mins : 00 secs</div>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="text-sm text-slate-600">Loading hot deals...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-600">No hot deals are available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg border border-red-300/50 overflow-hidden text-center bg-white shadow-sm hover:shadow-lg transition">
              <div className="h-32 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-slate-800">{product.name}</p>
                <p className="text-xl font-black text-red-600 mt-1">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Sale</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DealsSection;