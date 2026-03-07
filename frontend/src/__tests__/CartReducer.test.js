// Tests for the cart reducer logic extracted from CartContext
// The reducer is tested in isolation without React or network calls.

const initial = { items: [] };

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
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

describe('cart reducer', () => {
  it('adds a new item to an empty cart', () => {
    const product = { id: 1, name: 'Shirt', price: 10 };
    const state = reducer(initial, { type: 'ADD', item: product, qty: 1 });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 1, qty: 1 });
  });

  it('increments qty when adding an existing item', () => {
    const product = { id: 1, name: 'Shirt', price: 10 };
    const stateOne = reducer(initial, { type: 'ADD', item: product, qty: 1 });
    const stateTwo = reducer(stateOne, { type: 'ADD', item: product, qty: 3 });
    expect(stateTwo.items).toHaveLength(1);
    expect(stateTwo.items[0].qty).toBe(4);
  });

  it('adds multiple distinct items', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 5 }, qty: 1 });
    const s2 = reducer(s1, { type: 'ADD', item: { id: 2, name: 'B', price: 8 }, qty: 2 });
    expect(s2.items).toHaveLength(2);
  });

  it('removes an item by id', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 5 }, qty: 1 });
    const s2 = reducer(s1, { type: 'ADD', item: { id: 2, name: 'B', price: 8 }, qty: 1 });
    const s3 = reducer(s2, { type: 'REMOVE', id: 1 });
    expect(s3.items).toHaveLength(1);
    expect(s3.items[0].id).toBe(2);
  });

  it('does nothing when removing a non-existent id', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 5 }, qty: 2 });
    const s2 = reducer(s1, { type: 'REMOVE', id: 99 });
    expect(s2.items).toHaveLength(1);
  });

  it('updates the quantity of an existing item', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 5 }, qty: 1 });
    const s2 = reducer(s1, { type: 'UPDATE_QTY', id: 1, qty: 5 });
    expect(s2.items[0].qty).toBe(5);
  });

  it('clears all items', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 5 }, qty: 1 });
    const s2 = reducer(s1, { type: 'ADD', item: { id: 2, name: 'B', price: 8 }, qty: 2 });
    const s3 = reducer(s2, { type: 'CLEAR' });
    expect(s3.items).toHaveLength(0);
  });

  it('computes correct total for multiple items', () => {
    const s1 = reducer(initial, { type: 'ADD', item: { id: 1, name: 'A', price: 10 }, qty: 2 });
    const s2 = reducer(s1, { type: 'ADD', item: { id: 2, name: 'B', price: 5 }, qty: 3 });
    const total = s2.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    expect(total).toBe(35); // 10*2 + 5*3
  });

  it('returns current state for unknown action', () => {
    const state = reducer(initial, { type: 'UNKNOWN' });
    expect(state).toBe(initial);
  });
});
