import { api } from './api';
export const testimonialService = {
    list: () => api.get('/testimonials')
};
