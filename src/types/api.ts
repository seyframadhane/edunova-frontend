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
  isFree?: boolean;

  rating: number;
  reviewsCount?: number;
  studentsCount?: number;
  enrolledCount?: number;
  likedPercentage?: number;

  durationHours: number;
  unitsCount: number;
  modulesCount: number;
  weeks?: number;
  hoursPerWeek?: number;

  isTrending?: boolean;
  isPublished?: boolean;

  contentType?: 'pdf' | 'video' | 'mixed';
  pdfUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoDurationSec?: number;

  institution?: string;
  institutionLogo?: string;

  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];

  modules?: { _id: string; title: string; lessonsCount?: number }[];

  // Flags populated by backend for the current user
  isEnrolled?: boolean;
  isWishlisted?: boolean;
}

export interface Instructor {
  _id: string;
  name: string;
  role: string;
  image?: string;
  avatar?: string;
  bio?: string;
  rating: number;
  coursesCount: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  role: 'user' | 'instructor' | 'admin';
  points: number;

  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };

  // Onboarding
  careerGoal?: 'Enter in new industry' | 'Hobby' | 'Advance in your field' | 'Self Improvement' | null;
  interests?: string[];
  city?: string;
  country?: string;
  onboardingCompleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number };
  message?: string;
}