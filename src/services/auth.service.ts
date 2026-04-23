import { api } from './api';
import type { User, ApiResponse } from '../types/api';

export const authService = {
  signup: (payload: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/signup', payload),
  login: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', payload),
  me: () => api.get<ApiResponse<User>>('/users/me'),
  updateProfile: async (data: { firstName?: string; lastName?: string; email?: string }) => {
    const res = await api.patch('/auth/me', data);
    return res.data.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.post('/auth/change-password', data);
    return res.data;
  },
};