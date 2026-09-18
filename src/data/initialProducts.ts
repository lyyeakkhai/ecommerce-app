import type { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    inStock: true,
    onSale: true,
  },
  {
    id: 'prod-2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    inStock: true,
    onSale: false,
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Vertical Mouse',
    price: 49.99,
    inStock: false,
    onSale: true,
  },
  {
    id: 'prod-4',
    name: 'Ultra-Wide Curved Monitor 34"',
    price: 499.00,
    inStock: true,
    onSale: true,
  },
  {
    id: 'prod-5',
    name: 'USB-C Multiport Hub Adapter',
    price: 39.95,
    inStock: false,
    onSale: false,
  },
];
