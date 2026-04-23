export interface Course {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: Instructor;
  price: number;
  oldPrice?: number;
  rating: number;
  durationHours: number;
  unitsCount: number;
  modulesCount: number;
  isTrending?: boolean;
}

export interface Instructor {
  _id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  coursesCount: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'instructor' | 'admin';
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number };
  message?: string;
}