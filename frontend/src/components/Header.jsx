import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { items } = useCart();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="header">
      <div className="logo"><Link to="/">React Webshop</Link></div>
      <nav>
        <Link to="/">Home</Link> {' | '}
        <Link to="/cart">Cart ({totalQty})</Link>
      </nav>
    </header>
  );
}