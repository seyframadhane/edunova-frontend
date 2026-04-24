import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, Star, Clock, Award, ThumbsUp, Users,
  Heart, ShoppingCart, Check, GraduationCap, Play,
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

      {/* TABS + CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-gray-200 flex gap-8 overflow-x-auto">
          {(['about', 'modules', 'instructor', 'reviews'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${
                tab === t
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
            {tab === 'modules' && <ModulesTab course={course} />}
            {tab === 'instructor' && <InstructorTab course={course} />}
            {tab === 'reviews' && <ReviewsTab reviews={reviews} />}
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
          className={`font-semibold text-gray-900 ${
            linkable ? 'underline underline-offset-2' : ''
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

function AboutTab({ course }: { course: any }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">About this course</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {course.description || 'No description available yet.'}
        </p>
      </section>

      {course.whatYouWillLearn?.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">What you'll learn</h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {course.whatYouWillLearn.map((item: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <Check size={16} className="text-[#6C3EF4] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.requirements?.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {course.requirements.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {course.targetAudience?.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Who this is for</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {course.targetAudience.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ModulesTab({ course }: { course: any }) {
  const modules = course.modules ?? [];
  if (!modules.length)
    return <p className="text-sm text-gray-500">Curriculum coming soon.</p>;
  return (
    <div className="space-y-3">
      {modules.map((m: any, i: number) => (
        <div
          key={m._id || i}
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-purple-50 text-[#6C3EF4] flex items-center justify-center text-sm font-bold shrink-0">
            {i + 1}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{m.title}</h4>
            {m.lessonsCount != null && (
              <p className="text-xs text-gray-500 mt-1">{m.lessonsCount} lessons</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function InstructorTab({ course }: { course: any }) {
  const i = course.instructor || {};
  const initials = (i.name || 'IN')
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white font-semibold overflow-hidden shrink-0">
        {i.avatar || i.image ? (
          <img src={i.avatar || i.image} className="w-full h-full object-cover" alt="" />
        ) : (
          initials
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{i.name || 'EduNova Team'}</h3>
        <p className="text-sm text-[#6C3EF4] mb-2">{i.role || 'Instructor'}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{i.bio || 'Bio coming soon.'}</p>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews }: { reviews: any[] }) {
  if (!reviews.length)
    return (
      <p className="text-sm text-gray-500">No reviews yet. Be the first to review this course!</p>
    );
  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              {r.user?.avatar ? (
                <img src={r.user.avatar} className="w-full h-full object-cover" alt="" />
              ) : (
                `${r.user?.firstName?.[0] || '?'}${r.user?.lastName?.[0] || ''}`
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {r.user?.firstName} {r.user?.lastName}
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}