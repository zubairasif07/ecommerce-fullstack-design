// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubNav from '../components/SubNav';
import type { Product } from '../types';
import * as api from '../services/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Heart, ShoppingCart } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('Product not found');
          return;
        }

        const data = await api.fetchProductById(parseInt(id, 10));
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product, quantity);
      alert(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
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

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <SubNav />
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <SubNav />
          <div className="text-center py-20">
            <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const productPrice = typeof product.price === 'string' 
    ? parseFloat(product.price) 
    : product.price;

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-lg w-full flex items-center justify-center aspect-square">
              <img
                src={product.image || ''}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">No Image Available</div>';
                  }
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Category */}
            {product.category && (
              <p className="text-sm text-gray-600 font-medium">
                Category: {product.category.name}
              </p>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

            {/* Price */}
            <div className="border-y-2 border-gray-200 py-4">
              <p className="text-3xl font-bold text-blue-600">
                ${productPrice.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Stock Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              {product.stock > 0 ? (
                <p className="text-green-700 font-semibold">
                  ✓ {product.stock} items in stock
                </p>
              ) : (
                <p className="text-red-700 font-semibold">✗ Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.is_active && product.stock > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded transition"
                  >
                    −
                  </button>
                  <span className="text-2xl font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.is_active || product.stock === 0}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Heart
                  size={24}
                  className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}
                />
                {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-2 text-sm text-gray-600">
              <p>✓ Free shipping on orders over $50</p>
              <p>✓ Easy returns within 30 days</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

