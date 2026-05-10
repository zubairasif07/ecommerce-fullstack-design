import React from 'react';

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
  return (
    <div 
      className="product-card"
      onClick={() => onViewProduct?.(product)}
      style={{cursor: 'pointer'}}
    >
      {product.tags && product.tags.includes("New") && (
        <span className="badge">New</span>
      )}
      
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-rating">
          {'★'.repeat(Math.round(product.rating))}
          {'☆'.repeat(5 - Math.round(product.rating))}
          <span style={{color: '#6c757d', fontSize: '12px', marginLeft: '5px'}}>
            ({product.reviews})
          </span>
        </div>
        
        <div className="product-price-row">
          <div>
            <span className="price">${product.price}</span>
            {product.oldPrice && (
              <span className="price-old">${product.oldPrice}</span>
            )}
          </div>
          
          <button
            type="button"
            className="btn-add-cart"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
