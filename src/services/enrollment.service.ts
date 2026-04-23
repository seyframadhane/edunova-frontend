import { api } from './api';
export const enrollmentService = {
  mine:    () => api.get('/enrollments/me'),
  enroll:  (courseId: string) => api.post('/enrollments', { courseId }),
  progress:(id: string, progress: number, lessonId?: string) =>
    api.patch(`/enrollments/${id}/progress`, { progress, lessonId }),
};