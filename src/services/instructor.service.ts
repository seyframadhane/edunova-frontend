import { api } from './api';
export const instructorService = {
    list: () => api.get('/instructors'),
    detail: (id: string) => api.get(`/instructors/${id}`)
};  