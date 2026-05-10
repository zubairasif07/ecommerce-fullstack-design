import React, { useState, useEffect } from 'react';
import ProductCard from "./ProductCard";
import { api } from '../api';

export default function Products({ onAddToCart, filter = 'All', searchQuery = '', maxPrice = null, onViewProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts(filter, searchQuery, maxPrice);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadProducts();
  }, [filter, searchQuery, maxPrice]);

  const title = searchQuery
    ? `Search results for "${searchQuery}"`
    : filter === 'All'
    ? 'Featured Products'
    : `${filter} Collection`;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h3 style={{fontSize: '24px', fontWeight: '600'}}>{title}</h3>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '60px'}}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
          <h5>
            No products found {searchQuery ? `for "${searchQuery}"` : `for "${filter}"`}.
          </h5>
          <p style={{color: '#6c757d'}}>Try another category, search term, or filter.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onViewProduct={onViewProduct} 
            />
          ))}
        </div>
      )}
    </div>
  );
}