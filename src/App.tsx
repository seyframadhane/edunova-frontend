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

/**
 * OnboardingGuard
 * ---------------
 * Rules:
 *  - While loading auth state → show nothing (avoids flash)
 *  - Public paths (/, /login, /signup, /contact, /edu-partner) → always accessible
 *  - Logged-in user, onboarding NOT complete, NOT on /onboarding → redirect to /onboarding
 *  - Logged-in user, onboarding complete, ON /onboarding → redirect to /home
 *  - Not logged-in, on a protected path → redirect to /login (handled by ProtectedRoute on nested routes)
 *  - Everything else → render as-is
 */
function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show blank while resolving auth state to avoid redirect flicker
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    );
  }

  const publicPaths = ['/', '/login', '/signup', '/contact', '/edu-partner'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // Public paths are always accessible
  if (isPublicPath) return <>{children}</>;

  // Not logged in on a non-public path → send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but onboarding not done → force onboarding (unless already there)
  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarding done but trying to visit /onboarding again → redirect to home
  if (user.onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <OnboardingGuard>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/signup"      element={<SignUpPage />} />
        <Route path="/onboarding"  element={<OnboardingPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/edu-partner" element={<EduPartnerPage />} />

        {/* ── Auth-required standalone routes ── */}
        <Route path="/learn/course/:id"     element={<CourseLearningPage />} />
        <Route path="/learn/course/:id/pdf" element={<CoursePDFPage />} />
        <Route path="/quiz/:id"             element={<QuizPage />} />

        {/* ── Main layout routes ── */}
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

        {/* ── Admin routes ── */}
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