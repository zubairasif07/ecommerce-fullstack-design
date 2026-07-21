import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Hero({ onNavigate }) {
  const [heroSettings, setHeroSettings] = useState({
    hero_title: 'Engineered for Performance',
    hero_subtitle: 'Discover our latest collection of premium laptops designed for professionals and creators. Uncompromising power meets elegant design.',
    hero_image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop'
  });

  useEffect(() => {
    api.getSettings().then(settings => {
      setHeroSettings(prev => ({
        hero_title: settings.hero_title || prev.hero_title,
        hero_subtitle: settings.hero_subtitle || prev.hero_subtitle,
        hero_image: settings.hero_image || prev.hero_image
      }));
    }).catch(e => console.error(e));
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-banner">
          <div className="hero-content">
            <h1>{heroSettings.hero_title}</h1>
            <p>{heroSettings.hero_subtitle}</p>
            <button className="btn-primary" onClick={() => onNavigate?.('products')}>
              Shop Now
            </button>
          </div>
          <div className="hero-image">
            <img src={heroSettings.hero_image} alt="Hero Banner" />
          </div>
        </div>
      </div>
    </section>
  );
}
