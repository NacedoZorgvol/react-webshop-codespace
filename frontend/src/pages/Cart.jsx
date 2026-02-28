import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, remove, updateQty, clear } = useCart();
  const navigate = useNavigate();
  const subtotal = items.reduce((s,i)=>s + i.price * i.qty, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map(i => (
              <div key={i.id} className="card row">
                <img src={i.image} alt={i.name} style={{width:90,height:70,objectFit:'cover',borderRadius:6}}/>
                <div style={{flex:1}}>
                  <div>{i.name}</div>
                  <div>${i.price.toFixed(2)}</div>
                </div>
                <div>
                  <input type="number" min="1" value={i.qty} onChange={e => updateQty(i.id, Math.max(1, parseInt(e.target.value || 1)))} style={{width:60}} />
                </div>
                <div>
                  <button className="btn" onClick={()=>remove(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:20}}>
            <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
            <div style={{display:'flex',gap:12}}>
              <button className="btn" onClick={()=>navigate('/checkout')}>Checkout</button>
              <button className="btn" onClick={()=>clear()}>Clear cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}