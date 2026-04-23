import { api } from './api';
export const contactService = {
    send: (p: any) => api.post('/contact', p)
};