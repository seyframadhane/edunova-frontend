import { api } from './api';
export const cartService = {
  get:    () => api.get('/cart'),
  add:    (courseId: string) => api.post('/cart', { courseId }),
  remove: (courseId: string) => api.delete(`/cart/${courseId}`),
  checkout: (payload: { couponCode?: string; redeemPoints?: number }) =>
    api.post('/cart/checkout', payload),
};