import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import MainLayout from './components/layout/MainLayout';
import { useAuth } from './context/AuthContext';

import Home from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyLearningPage from './pages/MyLearningPage';
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SettingsPage from './pages/SettingsPage';
import EduPartnerPage from './pages/EduPartnerPage';
import NotFoundPage from './pages/NotFoundPage';
import CoursePDFPage from './pages/CoursePDFPage';
import ProfilePage from './pages/ProfilePage';
import CourseLearningPage from './pages/CourseLearningPage';
import QuizPage from './pages/QuizPage';

import AdminLayout from './admin/layout/AdminLayout';
import AdminGuard from './admin/components/AdminGuard';
import AdminCoursesNewPage from './admin/pages/AdminCoursesNewPage';
import AdminCoursesEditPage from './admin/pages/AdminCoursesEditPage';
import AdminInstructorsNewPage from './admin/pages/AdminInstructorsNewPage';
import AdminNotificationsPage from './admin/pages/AdminNotificationsPage';

function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const publicPaths = ['/', '/login', '/signup', '/contact', '/edu-partner'];
  const isPublic = publicPaths.includes(location.pathname);

  if (loading) return null;
  if (!user || isPublic) return <>{children}</>;

  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (user.onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <OnboardingGuard>
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/signup"      element={<SignUpPage />} />
        <Route path="/onboarding"  element={<OnboardingPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/edu-partner" element={<EduPartnerPage />} />
        <Route path="/learn/course/:id"     element={<CourseLearningPage />} />
        <Route path="/learn/course/:id/pdf" element={<CoursePDFPage />} />
        <Route path="/quiz/:id"             element={<QuizPage />} />

        <Route element={<MainLayout />}>
          <Route path="/home"        element={<Home />} />
          <Route path="/courses"     element={<CoursesPage />} />
          <Route path="/course/:id"  element={<CourseDetailPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/wishlist"    element={<WishlistPage />} />
          <Route path="/cart"        element={<CartPage />} />
          <Route path="/settings"    element={<SettingsPage />} />
          <Route path="/profile"     element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index                   element={<div>Admin Dashboard</div>} />
          <Route path="courses/new"      element={<AdminCoursesNewPage />} />
          <Route path="courses/:id/edit" element={<AdminCoursesEditPage />} />
          <Route path="instructors/new"  element={<AdminInstructorsNewPage />} />
          <Route path="notifications"    element={<AdminNotificationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </OnboardingGuard>
  );
}

export default App;