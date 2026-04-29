import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

import Header from '../components/landingPage/Header';
import Testimonials from '../components/landingPage/Testimonials';
import Footer from '../components/landingPage/Footer';

import HeroImage from '../assets/landingPage/Landing_Page_Hero_1.png';
import HeroImageTwo from '../assets/landingPage/Landing_Page_Hero_2.png';
import DefaultCourseImage from '../assets/landingPage/Default_Course_img.png';
import SkillImage from '../assets/landingPage/Landing_Page_img_1.png';

const LandingPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  const stats = [
    { value: '10K+', label: 'Active Students' },
    { value: '120+', label: 'Online Courses' },
    { value: '50+', label: 'Expert Mentors' },
    { value: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Smart Learning',
      description:
        'Learn with a modern platform designed to help you study better, faster, and with more focus.',
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Expert Instructors',
      description:
        'Access high-quality lessons created by professionals with practical industry experience.',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Practical Courses',
      description:
        'Build real skills through structured courses, lessons, quizzes, and learning resources.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Certificates',
      description:
        'Earn certificates after completing courses and showcase your progress with confidence.',
    },
  ];

  const courses = [
    {
      title: 'Web Development Masterclass',
      category: 'Development',
      level: 'Beginner Friendly',
      rating: '4.9',
    },
    {
      title: 'UI/UX Design Essentials',
      category: 'Design',
      level: 'Intermediate',
      rating: '4.8',
    },
    {
      title: 'Data Science Fundamentals',
      category: 'Data Science',
      level: 'Beginner',
      rating: '4.9',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F6F2FF] to-[#EEF5FF]">
          <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-purple-200/60 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-blue-200/60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                A better way to learn online
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Learn new skills with a beautiful, modern platform.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                EduNova helps students discover quality courses, learn from
                experienced mentors, track progress, and build real career-ready
                skills.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-700"
                >
                  Start Learning
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate('/courses')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:text-purple-700"
                >
                  <PlayCircle className="h-5 w-5" />
                  Explore Courses
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Beginner friendly
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Learn at your pace
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Certificate included
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="w-full max-w-[500px] aspect-square bg-indigo-100 flex items-center justify-center text-primary font-semibold relative rounded-[50%_50%_40%_40%/60%_60%_40%_40%] overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={HeroImage}
                    alt="Landing Page Hero"
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-[10%] left-0 bg-white p-3 md:p-5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  📚
                </div>
                <div className="flex flex-col text-sm text-gray-800 leading-tight">
                  <strong>100+</strong>
                  <span>Courses</span>
                </div>
              </div>

              <div className="absolute bottom-[15%] right-0 bg-white p-3 md:p-5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float [animation-delay:1.5s]">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  🎓
                </div>
                <div className="flex flex-col text-sm text-gray-800 leading-tight">
                  <strong>Expert</strong>
                  <span>Mentors</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center"
              >
                <p className="text-3xl font-black text-purple-700">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">
              Why Choose EduNova
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Everything you need to learn professionally.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A clean, simple, and powerful learning experience for students who
              want to grow their skills with confidence.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-purple-100 p-3 text-purple-700">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Section */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="rounded-[2rem] bg-slate-50 p-3 shadow-xl shadow-slate-200/60">
                <img
                  src={SkillImage}
                  alt="Learning experience"
                  className="h-[420px] w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">
                Learn Smarter
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Build skills with clear lessons and guided progress.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                EduNova makes online learning feel simple and organized. Follow
                lessons, complete quizzes, track progress, and continue learning
                at your own pace.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Organized course structure',
                  'Video, PDF, quiz, and certificate support',
                  'Modern dashboard for students',
                  'AI-assisted learning experience',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/courses')}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-purple-700"
              >
                Browse Courses
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section id="courses" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">
                Popular Courses
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Start with our top courses.
              </h2>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
            >
              View All Courses
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <img
                  src={DefaultCourseImage}
                  alt={course.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                      {course.category}
                    </span>

                    <span className="flex items-center gap-1 text-sm font-black text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      {course.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {course.level}
                  </p>

                  <button
                    onClick={() => navigate('/courses')}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-purple-700 transition hover:text-purple-900"
                  >
                    Explore Course
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Keep your original Testimonials component */}
        <Testimonials />

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center shadow-2xl shadow-purple-200 sm:p-14">
            <img
              src={HeroImageTwo}
              alt=""
              className="absolute right-0 top-0 hidden h-full w-1/3 object-cover opacity-20 lg:block"
            />

            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ready to start learning with EduNova?
              </h2>

              <p className="mt-5 text-lg leading-8 text-purple-50">
                Join today and take your first step toward building better
                skills, stronger confidence, and a brighter future.
              </p>

              <button
                onClick={() => navigate('/signup')}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-purple-700 transition hover:-translate-y-0.5 hover:bg-purple-50"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;