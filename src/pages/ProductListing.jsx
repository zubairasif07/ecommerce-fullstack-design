import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Footer from "../components/Footer";

import { api } from '../api';

export default function ProductListing({ onNavigate, onAddToCart, cartCount, activeFilter, onFilterChange, searchQuery, onSearchChange, onViewProduct, user, onLogout }) {
  const [priceRange, setPriceRange] = useState(2000);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    api.getCategories().then(data => {
      setCategories(data);
    }).catch(console.error);
  }, []);

  const allFilters = ['All', ...categories.map(c => c.name)];

  return (
    <>
      <Navbar
        activePage="products"
        onNavigate={onNavigate}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        user={user}
        onLogout={onLogout}
      />

      <div className="container">
        <div className="page-layout">
          <aside className="sidebar">
            <div className="filter-group">
              <h4>Categories</h4>
              {allFilters.map((filter) => (
                <label className="filter-option" key={filter} style={{cursor: 'pointer'}}>
                  <input 
                    type="checkbox" 
                    checked={activeFilter === filter || (filter === 'All' && !activeFilter)} 
                    onChange={() => onFilterChange(filter)} 
                  />
                  {filter}
                </label>
              ))}
            </div>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                style={{width: '100%', marginBottom: '10px'}}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', color: '#6c757d', fontSize: '14px'}}>
                <span>$0</span>
                <span>${priceRange}</span>
              </div>
            </div>
            
            <div className="filter-group">
              <h4>Availability</h4>
              <label className="filter-option"><input type="checkbox" defaultChecked /> In Stock</label>
              <label className="filter-option"><input type="checkbox" /> Ships in 24 hours</label>
            </div>
          </aside>

          <main style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0'}}>
              <h2 style={{fontSize: '24px', margin: 0}}>
                {activeFilter && activeFilter !== 'All' ? activeFilter : 'All Products'}
              </h2>
              <select className="desktop-sort" style={{padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#fff'}}>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
            
            <div className="mobile-filter-row">
              <button style={{flex: 1, padding: '10px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                Sort: Newest
              </button>
              <button style={{flex: 1, padding: '10px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                Filter (3)
              </button>
              <div style={{display: 'flex', gap: '5px'}}>
                 <button style={{padding: '10px', background: '#f5f5f5', border: 'none', borderRadius: '4px'}}>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                 </button>
                 <button style={{padding: '10px', background: '#e0f7fa', color: '#0056b3', border: 'none', borderRadius: '4px'}}>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                 </button>
              </div>
            </div>

            <div className="mobile-list-view">
              <Products 
                onAddToCart={onAddToCart} 
                filter={activeFilter} 
                searchQuery={searchQuery} 
                maxPrice={priceRange}
                onViewProduct={onViewProduct} 
              />
            </div>
          </main>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
