import { api } from './api';
export const wishlistService = {
  get:    () => api.get('/wishlist'),
  toggle: (courseId: string) => api.post(`/wishlist/${courseId}`),
};