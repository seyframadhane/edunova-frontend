import { api } from './api';
import type { Course, ApiResponse } from '../types/api';

export const courseService = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse<Course[]>>('/courses', { params }),

  detail: (id: string) =>
    api.get<ApiResponse<Course>>(`/courses/${id}`),

  // ✅ NEW — courses matching the logged-in user's onboarding data
  recommended: (params?: { limit?: number }) =>
    api.get<ApiResponse<Course[]>>('/courses/recommended', { params }),

  uploadVideo: async (id: string, file: File): Promise<Course> => {
    const fd = new FormData();
    fd.append('video', file);
    const res = await api.post<ApiResponse<Course>>(`/courses/${id}/video`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};