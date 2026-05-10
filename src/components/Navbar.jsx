import React, { useState } from 'react';

export default function Navbar({ activePage = 'home', onNavigate, cartCount = 0, searchQuery = '', onSearchChange, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (activePage !== 'products') {
      onNavigate?.('products');
    }
  };

  const nav = (page) => {
    setIsMenuOpen(false);
    onNavigate?.(page);
  };

  return (
    <>
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <a href="#language" onClick={(e) => { e.preventDefault(); alert('Additional language support is coming soon!'); }}>🌍 English</a>
            <a href="#support" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }}>🎧 Support</a>
            <a href="#account" onClick={(e) => { e.preventDefault(); onNavigate?.('auth'); }}>👤 My Account</a>
          </div>
        </div>
        
        <div className="main-header">
          <div className="container">
            <button className="mobile-nav-toggle" onClick={() => activePage === 'home' ? setIsMenuOpen(true) : onNavigate?.('home')}>
              {activePage === 'home' ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              )}
            </button>
            
            <div className="brand-logo" onClick={() => onNavigate?.('home')} style={{cursor: 'pointer'}}>
              <span>Shop</span>Sphere
            </div>
            
            <form className="search-wrapper" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Search products, brands and categories..." 
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            
            <div className="header-actions">
              {user ? (
                <>
                  <button className="header-action-btn" onClick={() => onNavigate?.('auth')}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>Hi, {user.name}</span>
                  </button>
                  {user.is_admin && (
                    <button className="header-action-btn" onClick={() => onNavigate?.('admin-dashboard')} style={{ color: '#0056b3' }}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span style={{ fontWeight: 'bold' }}>Admin</span>
                    </button>
                  )}
                  <button className="header-action-btn" onClick={onLogout}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button className="header-action-btn" onClick={() => onNavigate?.('auth')}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>Sign In</span>
                </button>
              )}
              <button className="header-action-btn" onClick={() => onNavigate?.('cart')}>
                <div style={{position: 'relative'}}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -8, right: -12, 
                      background: '#0056b3', color: 'white', 
                      borderRadius: '50%', padding: '2px 6px', fontSize: '10px'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="sub-header">
          <div className="container">
            <ul>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); onNavigate?.('products'); }}>All Products</a></li>
              <li><a href="#laptops" onClick={(e) => { e.preventDefault(); onNavigate?.('products'); }}>Laptops</a></li>
              <li><a href="#desktops" onClick={(e) => { e.preventDefault(); onNavigate?.('products'); }}>Desktops</a></li>
              <li><a href="#tablets" onClick={(e) => { e.preventDefault(); onNavigate?.('products'); }}>Tablets</a></li>
              <li><a href="#accessories" onClick={(e) => { e.preventDefault(); onNavigate?.('products'); }}>Accessories</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
           <div className="drawer-user">
             <div className="drawer-avatar">
               <svg fill="currentColor" viewBox="0 0 24 24" width="32" height="32"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             </div>
             {user ? (
                <span>{user.name}</span>
             ) : (
                <div onClick={() => nav('auth')} style={{cursor: 'pointer', fontWeight: '500'}}>Sign in | Register</div>
             )}
           </div>
           <button className="drawer-close" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        
        <div className="drawer-content">
          <ul className="drawer-menu">
            <li onClick={() => nav('home')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg> Home
            </li>
            <li onClick={() => nav('products')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg> Categories
            </li>
            <li onClick={() => nav('favorites')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> Favorites
            </li>
            <li onClick={() => nav('my-orders')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> My orders
            </li>
            {user?.is_admin && (
              <li onClick={() => nav('admin-dashboard')} style={{ color: '#0056b3', fontWeight: 'bold' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Admin Dashboard
              </li>
            )}
          </ul>
          
          <ul className="drawer-menu">
            <li onClick={() => alert('Additional language support coming soon!')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> English | USD
            </li>
            <li onClick={() => nav('contact')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> Contact us
            </li>
            <li onClick={() => nav('about')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> About
            </li>
          </ul>

          <ul className="drawer-menu no-icon">
            <li onClick={() => nav('user-agreement')}>User agreement</li>
            <li onClick={() => nav('partnership')}>Partnership</li>
            <li onClick={() => nav('privacy-policy')}>Privacy policy</li>
          </ul>
        </div>
      </div>
    </>
  );
}
