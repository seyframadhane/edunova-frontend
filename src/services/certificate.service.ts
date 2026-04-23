import { api } from './api';
export const certificateService = {
    mine: () => api.get('/certificates/me')
};