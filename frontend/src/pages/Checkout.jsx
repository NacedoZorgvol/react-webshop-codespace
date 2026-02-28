import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((s,i)=>s + i.price * i.qty, 0);

  function handlePlaceOrder() {
    // Mock placing order
    alert('Order placed! (mock)');
    clear();
    navigate('/');
  }

  if (items.length === 0) return <div><h2>No items to checkout</h2></div>;

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        {items.map(i => (
          <div key={i.id} style={{display:'flex',justifyContent:'space-between',padding:8,background:'#fff',marginBottom:6,borderRadius:6}}>
            <div>{i.name} x {i.qty}</div>
            <div>${(i.price * i.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button className="btn" onClick={handlePlaceOrder}>Place order (mock)</button>
    </div>
  );
}