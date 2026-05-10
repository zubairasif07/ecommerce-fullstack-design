import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from '../api';
const Checkout = ({ cartItems, onNavigate, searchQuery, onSearchChange, onClearCart, user, onLogout }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [customer, setCustomer] = useState({
    first_name: '', last_name: '', phone: '', street: '', city: '', state: '', zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const discount = appliedPromo ? subtotal * (appliedPromo.discount_percent / 100) : 0;
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, (subtotal - discount)) + shipping + tax;

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoCode) return;
    try {
      const promo = await api.validatePromoCode(promoCode);
      setAppliedPromo(promo);
    } catch (e) {
      setPromoError(e.message);
      setAppliedPromo(null);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to place an order.');
      onNavigate?.('auth');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsMap = {};
      cartItems.forEach(item => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += 1;
        } else {
          itemsMap[item.id] = { product_id: item.id, quantity: 1 };
        }
      });
      const formattedItems = Object.values(itemsMap);

      const order = await api.createOrder(formattedItems, appliedPromo?.code, customer, paymentMethod, null);
      
      alert('Order Placed Successfully!');
      onClearCart?.();
      onNavigate?.('home');

    } catch (error) {
      alert(error.message || 'An error occurred during checkout.');
    }
    setIsSubmitting(false);
  };



  return (
    <>
      <Navbar
        activePage="checkout"
        onNavigate={onNavigate}
        cartCount={cartItems.length}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        user={user}
        onLogout={onLogout}
      />

      <div className="container">
        <h1 style={{ fontSize: '32px', marginBottom: '30px', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px' }}>Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: '20px' }}>Your cart is empty.</p>
            <button className="btn-primary" onClick={() => onNavigate?.('products')}>Return to Shop</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items" style={{background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
              <h3 style={{fontSize: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '20px'}}>1. Shipping Address</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>First Name</label>
                  <input type="text" style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="Jane" value={customer.first_name} onChange={e => setCustomer({...customer, first_name: e.target.value})} required/>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>Last Name</label>
                  <input type="text" style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="Doe" value={customer.last_name} onChange={e => setCustomer({...customer, last_name: e.target.value})} required/>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>Mobile Number</label>
                  <input type="text" style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="(555) 123-4567" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} required/>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>Street Address</label>
                  <input type="text" style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="123 Main St" value={customer.street} onChange={e => setCustomer({...customer, street: e.target.value})} required/>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>City</label>
                  <input type="text" style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="New York" value={customer.city} onChange={e => setCustomer({...customer, city: e.target.value})} required/>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4a4a4a'}}>State / Zip</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input type="text" style={{width: '50%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="NY" value={customer.state} onChange={e => setCustomer({...customer, state: e.target.value})} required/>
                    <input type="text" style={{width: '50%', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}} placeholder="10001" value={customer.zip} onChange={e => setCustomer({...customer, zip: e.target.value})} required/>
                  </div>
                </div>
              </div>

              <h3 style={{fontSize: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '20px'}}>2. Payment Details</h3>
              
              <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="radio" name="paymentMethod" value="cod" checked={true} readOnly />
                  Cash on Delivery
                </label>
              </div>
            </div>

            <div className="cart-summary">
              <h3>Order Summary ({cartItems.length} items)</h3>
              
              <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {cartItems.map((item, index) => (
                  <div key={index} style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                    <div style={{color: '#4a4a4a', maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.name}</div>
                    <div style={{fontWeight: '600'}}>${parseFloat(item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} 
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button className="btn-primary" onClick={handleApplyPromo} style={{ padding: '10px 20px' }}>Apply</button>
                </div>
                {promoError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{promoError}</div>}
                {appliedPromo && <div style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>Promo "{appliedPromo.code}" applied! ({appliedPromo.discount_percent}% off)</div>}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedPromo && (
                <div className="summary-row" style={{ color: 'green' }}>
                  <span>Discount ({appliedPromo.discount_percent}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn-primary" 
                style={{width: '100%', fontSize: '18px', padding: '15px'}}
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order`}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default Checkout;
