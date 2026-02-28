import products from '../data/products.json';
export function getProducts() {
  return new Promise(resolve => setTimeout(() => resolve(products), 200));
}
export function getProductById(id) {
  return new Promise(resolve => {
    const p = products.find(x => String(x.id) === String(id));
    setTimeout(() => resolve(p || null), 150);
  });
}