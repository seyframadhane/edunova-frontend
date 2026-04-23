// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyLearningPage from "./pages/MyLearningPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import SettingsPage from "./pages/SettingsPage";
import EduPartnerPage from "./pages/EduPartnerPage";
import NotFoundPage from "./pages/NotFoundPage";
import CoursePDFPage from "./pages/CoursePDFPage";
import ProfilePage from './pages/ProfilePage';
import CourseLearningPage from './pages/CourseLearningPage';
import QuizPage from './pages/QuizPage';


// Admin
import AdminLayout from "./admin/layout/AdminLayout";
import AdminCoursesNewPage from "./admin/pages/AdminCoursesNewPage";
import AdminInstructorsNewPage from "./admin/pages/AdminInstructorsNewPage";
import AdminNotificationsPage from "./admin/pages/AdminNotificationsPage"; // <- add this page
import AdminGuard from "./admin/components/AdminGuard";
import AdminCoursesEditPage from "./admin/pages/AdminCoursesEditPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITHOUT Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/learn" element={<CourseLearningPage />} />

        {/* Pages WITH MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/edupartner" element={<EduPartnerPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />



          {/* Learner PDF page */}
          <Route path="/learn/course/:id" element={<CoursePDFPage />} />
        </Route>

        {/* Admin Routes (outside MainLayout) */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route
            index
            element={<div className="text-gray-400">Admin Dashboard (todo)</div>}
          />
          <Route path="courses/new" element={<AdminCoursesNewPage />} />
          <Route path="courses/:id/edit" element={<AdminCoursesEditPage />} />
          <Route path="instructors/new" element={<AdminInstructorsNewPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
