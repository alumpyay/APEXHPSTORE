import { Product, CurrencyRate, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_CURRENCIES: Record<string, CurrencyRate> = {
  MMK: { code: 'MMK', symbol: 'Ks', name: 'Myanmar Kyat', rate: 4200 }
};
export const MOCK_ORDERS: Order[] = [];
