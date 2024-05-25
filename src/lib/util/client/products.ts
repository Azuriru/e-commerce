import allProducts from '$lib/products.json';
import { shuffle } from '../array';

const _products = shuffle(allProducts);

const availableProducts = _products.slice(0, 30);
const unavailableProducts = _products.slice(30);

export { allProducts, unavailableProducts };

export default availableProducts;