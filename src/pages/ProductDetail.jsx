import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail({ onNavigate, onAddToCart, product, cartCount, searchQuery, onSearchChange, user, onLogout }) {
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <>
        <Navbar activePage="products" onNavigate={onNavigate} cartCount={cartCount} searchQuery={searchQuery} onSearchChange={onSearchChange} user={user} onLogout={onLogout} />
        <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
          <h2>Product not found</h2>
          <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => onNavigate?.('products')}>Return to products</button>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    );
  }

  return (
    <>
      <Navbar activePage="products" onNavigate={onNavigate} cartCount={cartCount} searchQuery={searchQuery} onSearchChange={onSearchChange} user={user} onLogout={onLogout} />

      <div className="container">
        <div style={{padding: '20px 0', fontSize: '14px', color: '#6c757d'}}>
          <span style={{cursor: 'pointer'}} onClick={() => onNavigate?.('home')}>Home</span> / 
          <span style={{cursor: 'pointer', margin: '0 5px'}} onClick={() => onNavigate?.('products')}>{product.category?.name || product.category}</span> / 
          <span style={{color: '#1a1a1a', margin: '0 5px'}}>{product.name}</span>
        </div>

        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-list">
              <div className="thumbnail active"><img src={product.image} alt="thumb" /></div>
              <div className="thumbnail"><img src={product.image} alt="thumb" style={{opacity: 0.5}} /></div>
              <div className="thumbnail"><img src={product.image} alt="thumb" style={{opacity: 0.5}} /></div>
            </div>
          </div>

          <div className="product-info-detail">
            <h1>{product.name}</h1>
            
            <div className="rating">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div className="detail-price">
              ${product.price}
              {product.oldPrice && <span style={{fontSize: '20px', color: '#6c757d', textDecoration: 'line-through', marginLeft: '15px'}}>${product.oldPrice}</span>}
            </div>
            
            <p style={{fontSize: '16px', lineHeight: '1.6', color: '#4a4a4a', marginBottom: '30px'}}>
              {product.description} {product.details}
            </p>
            
            <div className="specs-list">
              <div className="spec-item"><div className="spec-label">Availability:</div><div className="spec-value" style={{color: '#28a745'}}>In Stock</div></div>
              <div className="spec-item"><div className="spec-label">Category:</div><div className="spec-value">{product.category?.name || product.category}</div></div>
              <div className="spec-item"><div className="spec-label">Tags:</div><div className="spec-value">{product.tags?.join(', ')}</div></div>
            </div>
            
            <div className="action-row">
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <input type="text" className="qty-input" value={qty} readOnly />
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              
              <button className="btn-primary btn-large" onClick={() => {
                for (let i = 0; i < qty; i++) onAddToCart?.(product);
              }}>
                Add to Cart
              </button>
            </div>
            
            <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e0e0e0'}}>
              <div style={{display: 'flex', gap: '15px', color: '#4a4a4a'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>✓</span> Free Shipping
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>✓</span> 30-Day Returns
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>✓</span> 1 Year Warranty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
