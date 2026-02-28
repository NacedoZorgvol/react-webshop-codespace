import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <Link to={`/product/${product.id}`}> 
        <img src={product.image} alt={product.name} />
      </Link>
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <Link to={`/product/${product.id}`} className="btn">View</Link>
    </div>
  );
}