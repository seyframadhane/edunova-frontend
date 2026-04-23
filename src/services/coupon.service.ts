import { api } from './api';
export const couponService = {
    validate: (code: string) => api.post('/coupons/validate', { code })
};
