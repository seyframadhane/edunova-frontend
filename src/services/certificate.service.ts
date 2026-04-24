import {api} from './api';

export interface CertificateCourse {
  _id: string;
  title: string;
  image?: string;
  category?: string;
  level?: string;
  durationHours?: number;
  instructor?: { name?: string } | string;
}

export interface Certificate {
  _id: string;
  user: string;
  course: CertificateCourse;
  code: string;
  issuedAt: string;
  createdAt?: string;
}

export const certificateService = {
  mine: () =>
    api.get<{ success: true; data: Certificate[] }>('/certificates/me'),
};