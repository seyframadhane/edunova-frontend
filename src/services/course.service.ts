import { api } from './api';
import type { Course, ApiResponse } from '../types/api';

export const courseService = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse<Course[]>>('/courses', { params }),
  detail: (id: string) => api.get<ApiResponse<Course>>(`/courses/${id}`),
};