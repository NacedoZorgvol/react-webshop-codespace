import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:20}}>
      <img src={product.image} alt={product.name} style={{width:'100%',borderRadius:8}}/>
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>${product.price.toFixed(2)}</h3>
        <div style={{display:'flex',gap:12}}>
          <button className="btn" onClick={() => { add(product, 1); navigate('/cart'); }}>
            Add to cart & view cart
          </button>
          <button className="btn" onClick={() => add(product, 1)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}