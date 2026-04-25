import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Star, Clock, Award, ThumbsUp, Users, Heart, ShoppingCart,
  Check, GraduationCap, Play, FileText, Video, Mic,
  ChevronDown, ChevronUp, Target, AlertCircle, UserCheck,
  MessageSquare, Send, Sparkles, Calendar, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '../services/course.service';
import { cartService } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { enrollmentService } from '../services/enrollment.service';
import { reviewService } from '../services/review.service';
import { useAuth } from '../context/AuthContext';

type Tab = 'about' | 'modules' | 'instructor' | 'reviews';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('about');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([courseService.detail(id), reviewService.forCourse(id)])
      .then(([c, r]: any) => {
        setCourse(c.data.data);
        setReviews(r.data.data);
        setEnrolled(!!c.data.data.isEnrolled);
        setWishlisted(!!c.data.data.isWishlisted);
      })
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const requireAuth = () => {
    if (!user) {
      toast.error('Login required');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleEnroll = async () => {
    if (!requireAuth() || !id) return;
    try {
      await enrollmentService.enroll(id);
      setEnrolled(true);
      toast.success('Enrolled! Opening your classroom…');
      navigate(`/learn/course/${id}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Enroll failed');
    }
  };

  const handleAddCart = async () => {
    if (!requireAuth() || !id) return;
    try {
      await cartService.add(id);
      toast.success('Added to cart');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  const handleWishlist = async () => {
    if (!requireAuth() || !id) return;
    try {
      const { data }: any = await wishlistService.toggle(id);
      setWishlisted(data.data.wishlisted);
      toast.success(data.data.wishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  const formattedEnrolled = useMemo(() => {
    const n = course?.enrolledCount ?? course?.studentsCount ?? 0;
    return n.toLocaleString('en-US');
  }, [course]);

  const instructorInitials = useMemo(() => {
    const name = course?.instructor?.name || 'EduNova';
    return name.split(' ').map((s: string) => s[0]).join('').slice(0, 2).toUpperCase();
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#6C3EF4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-10 text-center text-gray-500">Course not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100/40 to-pink-50">
        {/* Decorative arcs on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block">
          <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-[#6C3EF4]/10" />
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-[30px] border-[#EC4899]/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
          {/* Institution */}
          <div className="flex items-center gap-3 mb-6">
            {course.institutionLogo ? (
              <img src={course.institutionLogo} alt={course.institution} className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#6C3EF4] flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
            )}
            <span className="font-bold text-gray-900 uppercase tracking-wide text-sm">
              {course.institution || 'EduNova Academy'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 max-w-2xl leading-tight">
            {course.title}
          </h1>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              {course.instructor?.avatar || course.instructor?.image ? (
                <img
                  src={course.instructor.avatar || course.instructor.image}
                  alt={course.instructor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                instructorInitials
              )}
            </div>
            <span className="text-sm text-gray-700">
              Instructor:{' '}
              <span className="font-semibold text-[#6C3EF4] underline underline-offset-2">
                {course.instructor?.name || 'EduNova Team'}
              </span>
            </span>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {enrolled ? (
              <button
                onClick={() => navigate(`/learn/course/${id}`)}
                className="px-8 py-3 bg-[#6C3EF4] text-white rounded-full font-semibold hover:bg-[#5a30d4] transition flex items-center gap-2 shadow-lg shadow-purple-200"
              >
                <Play size={18} /> Continue learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                className="px-8 py-3 bg-[#6C3EF4] text-white rounded-full font-semibold hover:bg-[#5a30d4] transition shadow-lg shadow-purple-200"
              >
                Enroll now
              </button>
            )}
            <button
              onClick={handleAddCart}
              className="px-5 py-3 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-[#6C3EF4] hover:text-[#6C3EF4] transition flex items-center gap-2"
            >
              <ShoppingCart size={16} /> Add to cart
            </button>
            <button
              onClick={handleWishlist}
              className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-pink-300 transition"
              title="Wishlist"
            >
              <Heart
                size={18}
                className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}
              />
            </button>
          </div>

          <p className="text-sm text-gray-700 font-semibold">
            {formattedEnrolled}{' '}
            <span className="font-normal text-gray-600">already enrolled</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Price: <span className="font-bold text-gray-900">₹{course.price}</span>
            {course.oldPrice && (
              <span className="text-gray-400 line-through ml-2">₹{course.oldPrice}</span>
            )}
          </p>
        </div>
      </section>

      {/* STATS BAR (overlaps hero) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100">
          <Stat
            icon={<BookOpen size={18} />}
            value={`${course.modulesCount ?? course.modules?.length ?? 0} modules`}
            label="Gain insight and learn the fundamentals"
            linkable
          />
          <Stat
            icon={<Star size={18} className="fill-yellow-400 text-yellow-400" />}
            value={(course.rating ?? 0).toFixed(1)}
            label={`${(course.reviewsCount ?? 0).toLocaleString()} reviews`}
          />
          <Stat
            icon={<Award size={18} />}
            value={`${course.level || 'Beginner'} level`}
            label={
              course.level === 'Beginner'
                ? 'No prior experience required'
                : 'Recommended experience'
            }
          />
          <Stat
            icon={<Clock size={18} />}
            value="Flexible schedule"
            label={`${course.weeks ?? 4} weeks at ${course.hoursPerWeek ?? 5} hours a week`}
            sub="Learn at your own pace"
          />
          <Stat
            icon={<ThumbsUp size={18} />}
            value={`${course.likedPercentage ?? 95}%`}
            label="Most learners liked this course"
          />
        </div>
      </div>

      {/* ── Choose how to study ── */}
      {/* <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Choose how to study</h3>
            <p className="text-sm text-slate-500">Pick the learning mode that fits you best</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to={`/courses/${id}/study/pdf`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 hover:border-[#6C3EF4] hover:bg-[#6C3EF4]/5 p-4 transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><FileText size={18} /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Study with PDF</div>
                <div className="text-xs text-slate-500">Read + ask AI</div>
              </div>
            </Link>
            <Link to={`/courses/${id}/study/video`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 hover:border-[#6C3EF4] hover:bg-[#6C3EF4]/5 p-4 transition">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><Video size={18} /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Study with Video</div>
                <div className="text-xs text-slate-500">Watch + emotion tracking</div>
              </div>
            </Link>
            <Link to={`/courses/${id}/study/voice`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 hover:border-[#6C3EF4] hover:bg-[#6C3EF4]/5 p-4 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><Mic size={18} /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Study with Voice</div>
                <div className="text-xs text-slate-500">Talk to AI tutor</div>
              </div>
            </Link>
          </div>
        </div>
      </div> */}

      {/* TABS + CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-gray-200 flex gap-8 overflow-x-auto">
          {(['about', 'modules', 'instructor', 'reviews'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${tab === t
                ? 'border-[#6C3EF4] text-[#6C3EF4]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {t} {t === 'reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {tab === 'about' && <AboutTab course={course} />}
            {tab === 'modules' && <ModulesTab course={course} enrolled={enrolled} />}
            {tab === 'instructor' && <InstructorTab course={course} />}
            {tab === 'reviews' && (
              <ReviewsTab
                courseId={id!}
                reviews={reviews}
                user={user}
                course={course}
                onAdded={(r) => setReviews((prev) => [r, ...prev.filter(x => x._id !== r._id)])}
              />)}
          </div>

          {/* Sticky sidebar card */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full aspect-video object-cover rounded-xl mb-4"
                />
              )}
              <div className="text-3xl font-bold text-[#6C3EF4] mb-1">₹{course.price}</div>
              {course.oldPrice && (
                <div className="text-sm text-gray-400 line-through mb-3">₹{course.oldPrice}</div>
              )}
              <ul className="space-y-2 text-sm text-gray-700 mb-5">
                <li className="flex items-center gap-2">
                  <Users size={14} className="text-[#6C3EF4]" /> {formattedEnrolled} students
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[#6C3EF4]" /> {course.modulesCount ?? 0} modules
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-[#6C3EF4]" /> {course.weeks ?? 4} weeks ·{' '}
                  {course.hoursPerWeek ?? 5}h/week
                </li>
                <li className="flex items-center gap-2">
                  <Award size={14} className="text-[#6C3EF4]" /> Certificate on completion
                </li>
              </ul>
              {enrolled ? (
                <button
                  onClick={() => navigate(`/learn/course/${id}`)}
                  className="w-full py-3 bg-[#6C3EF4] text-white rounded-full font-semibold hover:bg-[#5a30d4] transition flex items-center justify-center gap-2"
                >
                  <Play size={16} /> Continue
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-3 bg-[#6C3EF4] text-white rounded-full font-semibold hover:bg-[#5a30d4] transition"
                >
                  Enroll now
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------- small helpers ---------------- */

function Stat({
  icon, value, label, sub, linkable,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  linkable?: boolean;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#6C3EF4]">{icon}</span>
        <span
          className={`font-semibold text-gray-900 ${linkable ? 'underline underline-offset-2' : ''
            }`}
        >
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-snug">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}


/* =========================================================
   ABOUT TAB
   ========================================================= */
function AboutTab({ course }: { course: any }) {
  const [expanded, setExpanded] = useState(false);
  const desc: string = course.description || 'No description available yet.';
  const isLong = desc.length > 400;
  const shown = expanded || !isLong ? desc : desc.slice(0, 400) + '…';

  return (
    <div className="max-w-3xl">
      <h3 className="text-xl font-bold text-gray-900 mb-3">About this course</h3>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
        {shown}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[#6C3EF4] text-sm font-semibold inline-flex items-center gap-1 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   MODULES TAB
   ========================================================= */
function ModulesTab({ course, enrolled }: { course: any; enrolled: boolean }) {
  const modules = course.modules ?? [];
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set([0])); // first open by default

  if (!modules.length) {
    return (
      <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Curriculum is being prepared. Check back soon.</p>
      </div>
    );
  }

  const allOpen = openIdx.size === modules.length;
  const toggleAll = () => setOpenIdx(allOpen ? new Set() : new Set(modules.map((_: any, i: number) => i)));
  const toggle = (i: number) =>
    setOpenIdx((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const totalLessons = modules.reduce((s: number, m: any) => s + (m.lessonsCount ?? m.lessons?.length ?? 0), 0);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Course curriculum</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {modules.length} modules{totalLessons > 0 && ` · ${totalLessons} lessons`}
            {course.durationHours > 0 && ` · ${course.durationHours}h total`}
          </p>
        </div>
        <button
          onClick={toggleAll}
          className="text-sm font-semibold text-[#6C3EF4] hover:underline"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="space-y-3">
        {modules.map((m: any, i: number) => {
          const open = openIdx.has(i);
          const lessons = m.lessons ?? [];
          const lessonsCount = m.lessonsCount ?? lessons.length ?? 0;
          return (
            <div
              key={m._id ?? i}
              className={`rounded-xl border bg-white transition ${open ? 'border-purple-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3EF4] to-[#9b6dff] text-white flex items-center justify-center font-bold flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{m.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lessonsCount > 0 ? `${lessonsCount} lessons` : 'Module'}
                    {m.durationMinutes ? ` · ${Math.round(m.durationMinutes / 60)}h ${m.durationMinutes % 60}m` : ''}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {open && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    {lessons.length > 0 ? (
                      <ul className="space-y-2">
                        {lessons.map((l: any, idx: number) => (
                          <li
                            key={l._id ?? idx}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="w-7 h-7 rounded-md bg-purple-50 text-[#6C3EF4] flex items-center justify-center flex-shrink-0">
                              {l.videoUrl ? <Play className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-sm text-gray-700 flex-1 truncate">{l.title}</span>
                            {l.durationMinutes != null && (
                              <span className="text-xs text-gray-400">{l.durationMinutes} min</span>
                            )}
                            {!enrolled && (
                              <span className="text-xs text-gray-300">🔒</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Lesson list will appear once you enroll.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   INSTRUCTOR TAB
   ========================================================= */
function InstructorTab({ course }: { course: any }) {
  const i = course.instructor || {};
  const [expanded, setExpanded] = useState(false);
  const initials = (i.name || 'IN')
    .split(' ').map((s: string) => s[0]).join('').slice(0, 2).toUpperCase();

  const bio: string = i.bio || 'This instructor hasn\'t added a bio yet.';
  const isLong = bio.length > 280;
  const shown = expanded || !isLong ? bio : bio.slice(0, 280) + '…';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-[#6C3EF4] via-[#8a5cf6] to-[#b388ff]" />

      <div className="px-6 sm:px-8 pb-8 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#6C3EF4] to-[#9b6dff] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {i.avatar || i.image ? (
                <img src={i.avatar || i.image} alt={i.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900">{i.name || 'EduNova Team'}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{i.role || 'Senior Instructor'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <InstructorStat
            icon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            value={(i.rating ?? 0).toFixed(1)}
            label="Rating"
          />
          <InstructorStat
            icon={<BookOpen className="w-4 h-4 text-[#6C3EF4]" />}
            value={i.coursesCount ?? 1}
            label="Courses"
          />
          <InstructorStat
            icon={<Users className="w-4 h-4 text-emerald-600" />}
            value={(course.enrolledCount ?? 0).toLocaleString()}
            label="Students"
          />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{shown}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-[#6C3EF4] text-sm font-semibold inline-flex items-center gap-1 hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InstructorStat({ icon, value, label }: { icon: React.ReactNode; value: any; label: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-xl font-bold text-gray-900">{value}</span>
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

/* =========================================================
   REVIEWS TAB
   ========================================================= */
function ReviewsTab({
  courseId, reviews, user, course, onAdded,
}: {
  courseId: string;
  reviews: any[];
  user: any;
  course: any;
  onAdded: (review: any) => void;
}) {
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [showForm, setShowForm] = useState(false);

  // Distribution
  const total = reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, percent: total ? Math.round((count / total) * 100) : 0 };
  });
  const avg = total
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / total
    : course.rating ?? 0;

  // Filter + sort
  const visible = reviews
    .filter((r) => filter === 'all' || Math.round(r.rating) === filter)
    .sort((a, b) => {
      if (sort === 'highest') return b.rating - a.rating;
      if (sort === 'lowest') return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const ownReview = user ? reviews.find((r) => r.user?._id === user._id) : null;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-purple-50/50 to-white p-6">
        <div className="grid md:grid-cols-[260px_1fr] gap-6 items-center">
          {/* Big avg */}
          <div className="text-center md:border-r md:border-gray-200 md:pr-6">
            <div className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {total} {total === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {dist.map((d) => (
              <button
                key={d.star}
                onClick={() => setFilter(filter === d.star ? 'all' : d.star)}
                className={`w-full flex items-center gap-3 group ${filter === d.star ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                  }`}
              >
                <span className="w-8 text-sm font-medium text-gray-600 flex items-center gap-0.5">
                  {d.star} <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 group-hover:bg-yellow-500 transition-all"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-gray-500">{d.count}</span>
              </button>
            ))}
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-xs text-[#6C3EF4] font-semibold hover:underline mt-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#6C3EF4]"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          {user && !ownReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#6C3EF4] text-white rounded-full text-sm font-semibold hover:bg-[#5a30d4] transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write a review
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <ReviewForm
          courseId={courseId}
          onCancel={() => setShowForm(false)}
          onSubmitted={(r) => {
            onAdded(r);
            setShowForm(false);
          }}
        />
      )}

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
          <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">
            {user ? 'Be the first to share your experience!' : 'Log in to leave the first review.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <ReviewCard key={r._id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const u = review.user || {};
  const initials = `${u.firstName?.[0] || '?'}${u.lastName?.[0] || ''}`.toUpperCase();
  const date = review.createdAt ? formatRelative(review.createdAt) : '';

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 hover:border-purple-100 hover:shadow-sm transition">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#9b6dff] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h5 className="font-semibold text-gray-900">
              {u.firstName} {u.lastName}
            </h5>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {date}
            </span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          {review.comment && (
            <p className="text-gray-700 text-sm leading-relaxed mt-2.5 whitespace-pre-line">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewForm({
  courseId, onCancel, onSubmitted,
}: { courseId: string; onCancel: () => void; onSubmitted: (r: any) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!rating) return toast.error('Please pick a star rating');
    if (comment.trim().length < 5) return toast.error('Tell us a bit more (min 5 chars)');
    setSubmitting(true);
    try {
      const { data }: any = await reviewService.create({
        courseId, rating, comment: comment.trim(),
      });
      toast.success('Thanks for your review!');
      onSubmitted(data.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-1">Share your experience</h4>
      <p className="text-sm text-gray-500 mb-5">Your feedback helps other learners decide.</p>

      {/* Star picker */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((i) => {
          const active = i <= (hover || rating);
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${active ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
              />
            </button>
          );
        })}
        <span className="text-sm text-gray-500 ml-2">{labels[hover || rating]}</span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you like? What could be better?"
        rows={4}
        maxLength={1000}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-purple-100 resize-none"
      />
      <div className="text-right text-xs text-gray-400 mt-1">{comment.length}/1000</div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={submitting}
          className="px-5 py-2 rounded-full text-sm font-semibold bg-[#6C3EF4] text-white hover:bg-[#5a30d4] disabled:opacity-60 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   utils
   ========================================================= */
function formatRelative(iso: string) {
  const d = new Date(iso).getTime();
  const diff = (Date.now() - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}