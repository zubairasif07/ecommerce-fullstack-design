import React from 'react';

const categories = [
  { name: "Laptops", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop" },
  { name: "Desktops", img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=200&auto=format&fit=crop" },
  { name: "Tablets", img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=200&auto=format&fit=crop" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop" },
  { name: "Monitors", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200&auto=format&fit=crop" },
  { name: "Smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop" },
];

export default function Categories({ onSelectCategory }) {
  return (
    <div className="container">
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div 
            className="category-card" 
            key={index}
            onClick={() => onSelectCategory?.(cat.name)}
            style={{cursor: 'pointer'}}
          >
            <img src={cat.img} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
