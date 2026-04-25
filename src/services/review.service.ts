import { api } from './api';

export const reviewService = {
  forCourse: (id: string) => api.get(`/reviews/course/${id}`),
  create: (payload: { courseId: string; rating: number; comment?: string }) =>
    api.post('/reviews', payload),
};