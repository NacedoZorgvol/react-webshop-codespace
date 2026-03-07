import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { useCart } from '../context/CartContext';

// Mock useCart so we can control cart state in each test
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Jest allows variables starting with "mock" to be referenced in mock factories.
// The getter ensures the component always reads the latest value at render time.
let mockPaymentLink = '';
jest.mock('../services/config', () => ({
  get PAYMENT_LINK() {
    return mockPaymentLink;
  },
}));

const mockItems = [
  { id: 1, name: 'Test Shirt', price: 19.99, qty: 2 },
];

function renderCheckout(items) {
  useCart.mockReturnValue({
    items,
    add: jest.fn(),
    remove: jest.fn(),
    updateQty: jest.fn(),
    clear: jest.fn(),
  });

  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );
}

describe('Checkout component', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
    mockPaymentLink = '';
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('shows "No items to checkout" when cart is empty', () => {
    renderCheckout([]);
    expect(screen.getByText('No items to checkout')).toBeInTheDocument();
  });

  it('renders item names and total when cart has items', () => {
    renderCheckout(mockItems);
    expect(screen.getByText(/Test Shirt/)).toBeInTheDocument();
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it('shows disabled button and message when PAYMENT_LINK is empty', () => {
    renderCheckout(mockItems);
    const btn = screen.getByRole('button', { name: /Open Payment Link/i });
    expect(btn).toBeDisabled();
    expect(screen.getByText(/REACT_APP_PAYMENT_LINK_URL/)).toBeInTheDocument();
  });

  it('renders QR code and enabled button when PAYMENT_LINK is set', () => {
    mockPaymentLink = 'https://buy.stripe.com/test_abc123';
    renderCheckout(mockItems);
    const btn = screen.getByRole('button', { name: /Open Payment Link/i });
    expect(btn).not.toBeDisabled();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('calls window.open with correct URL when button is clicked', () => {
    mockPaymentLink = 'https://buy.stripe.com/test_abc123';
    renderCheckout(mockItems);
    const btn = screen.getByRole('button', { name: /Open Payment Link/i });
    fireEvent.click(btn);
    expect(window.open).toHaveBeenCalledWith(
      'https://buy.stripe.com/test_abc123',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
