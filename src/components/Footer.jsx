import React from 'react';

export default function Footer({ onNavigate }) {
  const handleLink = (e, page) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="#products" onClick={(e) => handleLink(e, 'products')}>Laptops</a></li>
              <li><a href="#products" onClick={(e) => handleLink(e, 'products')}>Desktops</a></li>
              <li><a href="#products" onClick={(e) => handleLink(e, 'products')}>Tablets</a></li>
              <li><a href="#products" onClick={(e) => handleLink(e, 'products')}>Accessories</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact" onClick={(e) => handleLink(e, 'contact')}>Contact Us</a></li>
              <li><a href="#returns" onClick={(e) => handleLink(e, 'returns')}>Returns & Order Status</a></li>
              <li><a href="#drivers" onClick={(e) => handleLink(e, 'drivers')}>Drivers & Software</a></li>
              <li><a href="#warranty" onClick={(e) => handleLink(e, 'warranty')}>Warranty Check</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleLink(e, 'about')}>About ShopSphere</a></li>
              <li><a href="#newsroom" onClick={(e) => handleLink(e, 'newsroom')}>Newsroom</a></li>
              <li><a href="#investors" onClick={(e) => handleLink(e, 'investors')}>Investor Relations</a></li>
              <li><a href="#careers" onClick={(e) => handleLink(e, 'careers')}>Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p style={{fontSize: '14px', color: '#6c757d', marginBottom: '15px'}}>Sign up for news and exclusive offers.</p>
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #e0e0e0'}} 
              />
              <button className="btn-primary" style={{padding: '10px 20px'}}>Sign Up</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
