// src/pages/Wishlist.tsx
import { useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';
import { Trash2, Heart, ShoppingCart } from 'lucide-react';

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      alert('Added to cart!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to add to cart';
      if (errorMessage.includes('Please log in')) {
        alert('Please log in to add items to your cart.');
        navigate('/login');
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />

        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600 mb-8">{wishlist.length} items saved</p>

          {wishlist.length === 0 ? (
            // Empty Wishlist
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Heart size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Save items you love for later
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Find Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in wishlist
                </h2>
                <button
                  onClick={() => {
                    if (window.confirm('Remove all items from wishlist?')) {
                      clearWishlist();
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-semibold transition text-sm"
                >
                  Clear Wishlist
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlist.map((product) => {
                  const price = typeof product.price === 'string'
                    ? parseFloat(product.price)
                    : product.price;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition"
                    >
                      {/* Image */}
                      <div 
                        className="relative h-40 bg-gray-200 rounded-t-lg cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={product.image || ''}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">No Image</div>';
                            }
                          }}
                        />
                        {!product.is_active && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 
                          className="font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                          {product.description}
                        </p>

                        <div className="mt-3 space-y-2">
                          <p className="text-lg font-bold text-blue-600">
                            ${price.toFixed(2)}
                          </p>

                          {product.stock > 0 && (
                            <p className="text-xs text-gray-600">
                              {product.stock} in stock
                            </p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 space-y-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.is_active || product.stock === 0}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-semibold py-2 rounded transition flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={18} />
                            Add to Cart
                          </button>

                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;

