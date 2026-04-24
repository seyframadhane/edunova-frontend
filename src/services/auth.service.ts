import { api } from './api';
import type { User, ApiResponse } from '../types/api';

export const authService = {
  signup: (payload: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/signup', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', payload),

  me: () => api.get<ApiResponse<User>>('/users/me'),

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.patch<ApiResponse<User>>('/auth/me', data);
    return res.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.post('/auth/change-password', data);
    return res.data;
  },

  // ✅ NEW — save onboarding data
   completeOnboarding: (payload: {
    careerGoal: string;
    interests: string[];
    city: string;
    country: string;
    avatar?: string;
  }) => api.post<ApiResponse<User>>('/auth/me/onboarding', payload),

  uploadAvatar: async (file: File): Promise<User> => {
    const fd = new FormData();
    fd.append('avatar', file);
    const res = await api.post<ApiResponse<User>>('/auth/me/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  uploadCover: async (file: File): Promise<User> => {
    const fd = new FormData();
    fd.append('cover', file);
    const res = await api.post<ApiResponse<User>>('/auth/me/cover', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};