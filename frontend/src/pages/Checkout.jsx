import React from 'react';
import DOMPurify from 'dompurify';
import QRCode from 'react-qr-code';
import { useCart } from '../context/CartContext';
import { PAYMENT_LINK } from '../services/config';

export default function Checkout() {
  const { items } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  function handleOpenPaymentLink() {
    window.open(PAYMENT_LINK, '_blank', 'noopener,noreferrer');
  }

  if (items.length === 0) return <div><h2>No items to checkout</h2></div>;

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        {items.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: '#fff', marginBottom: 6, borderRadius: 6 }}>
            <div>{DOMPurify.sanitize(`${i.name} x ${i.qty}`)}</div>
            <div>${(i.price * i.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <h3>Total: ${total.toFixed(2)}</h3>

      {PAYMENT_LINK ? (
        <div style={{ marginTop: 24 }}>
          <p>Scan the QR code below or click the button to pay via Stripe:</p>
          <div style={{ margin: '16px 0' }}>
            <QRCode value={PAYMENT_LINK} size={200} />
          </div>
          <button className="btn" onClick={handleOpenPaymentLink}>
            Open Payment Link
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <p style={{ color: '#888' }}>
            Online checkout is currently disabled. Set the{' '}
            <code>REACT_APP_PAYMENT_LINK_URL</code> environment variable to enable Stripe
            payments.
          </p>
          <button className="btn" disabled>
            Open Payment Link
          </button>
        </div>
      )}
    </div>
  );
}