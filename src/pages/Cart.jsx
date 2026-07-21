import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart({ cartItems, savedItems = [], onRemoveFromCart, onSaveForLater, onMoveToCart, onRemoveFromSaved, onNavigate, searchQuery, onSearchChange, user, onLogout }) {
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const tax = total * 0.08;
  const grandTotal = total + tax;

  return (
    <>
      <Navbar
        activePage="cart"
        onNavigate={onNavigate}
        cartCount={cartItems.length}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        user={user}
        onLogout={onLogout}
      />

      <div className="container">
        <h2 style={{marginTop: '40px', fontSize: '28px'}}>Your Cart</h2>
        
        {cartItems.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: '20px'}}>
            <h5>Your cart is currently empty.</h5>
            <p style={{color: '#6c757d', marginBottom: '20px'}}>Add products to your cart to see them here.</p>
            <button className="btn-primary" onClick={() => onNavigate?.('products')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p style={{color: '#6c757d', fontSize: '14px', marginBottom: '10px'}}>Item #: {item.id} | Qty: 1</p>
                    <div style={{display: 'flex', gap: '15px'}}>
                      <button onClick={() => onRemoveFromCart?.(index)} style={{background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0}}>Remove</button>
                      <button onClick={() => onSaveForLater?.(index)} style={{background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0}}>Save for Later</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span style={{color: '#28a745'}}>Free</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <button 
                className="btn-primary" 
                style={{width: '100%', fontSize: '18px', padding: '15px'}}
                onClick={() => onNavigate?.('checkout')}
              >
                Proceed to Checkout
              </button>
              
              <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
                {/* Dummy payment icons */}
                <div style={{width: '40px', height: '25px', background: '#e0e0e0', borderRadius: '4px'}}></div>
                <div style={{width: '40px', height: '25px', background: '#e0e0e0', borderRadius: '4px'}}></div>
                <div style={{width: '40px', height: '25px', background: '#e0e0e0', borderRadius: '4px'}}></div>
              </div>
            </div>
          </div>
        )}

        {savedItems.length > 0 && (
          <div style={{marginTop: '40px', borderTop: '1px solid #e0e0e0', paddingTop: '40px', marginBottom: '60px'}}>
            <h3 style={{fontSize: '24px', marginBottom: '20px'}}>Saved for Later ({savedItems.length} items)</h3>
            <div className="cart-items">
              {savedItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p style={{color: '#6c757d', fontSize: '14px', marginBottom: '10px'}}>Item #: {item.id}</p>
                    <div style={{display: 'flex', gap: '15px'}}>
                      <button onClick={() => onRemoveFromSaved?.(index)} style={{background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0}}>Remove</button>
                      <button onClick={() => onMoveToCart?.(index)} style={{background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0}}>Move to Cart</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
