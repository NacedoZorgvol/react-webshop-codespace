import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initial = {
  items: JSON.parse(localStorage.getItem('cart')) || []
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id);
      let items;
      if (exists) {
        items = state.items.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + action.qty } : i
        );
      } else {
        items = [...state.items, { ...action.item, qty: action.qty }];
      }
      return { ...state, items };
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    }
    case 'UPDATE_QTY': {
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const add = (item, qty = 1) => dispatch({ type: 'ADD', item, qty });
  const remove = id => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ items: state.items, add, remove, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}