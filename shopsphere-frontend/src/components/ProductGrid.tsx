// src/components/ProductGrid.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.name}
          price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
          image={product.image || ''}
          onAddToCart={() => handleAddToCart(product)}
          disabled={!product.is_active || product.stock === 0}
        />
      ))}
    </div>
  );
};
export default ProductGrid;