import { api } from './api';
export const reviewService = {
    forCourse: (id: string) => api.get(`/reviews/course/${id}`),
    create: (p: any) => api.post('/reviews', p)
};  