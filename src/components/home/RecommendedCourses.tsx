import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { CourseCard, type CourseProps } from '../ui/CourseCard';
import { courseService } from '../../services/course.service';
import { useAuth } from '../../context/AuthContext';

export default function RecommendedCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    courseService.recommended({ limit: 8 })
      .then(({ data }) => {
        const mapped: CourseProps[] = data.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          category: c.category,
          level: c.level,
          instructor: c.instructor?.name || 'EduNova',
          price: c.price,
          oldPrice: c.oldPrice,
          rating: c.rating,
          image: c.image,
        }));
        setCourses(mapped);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const title = user.interests?.length
    ? `Picked for you · ${user.interests.slice(0, 2).join(' + ')}`
    : 'Picked for you';

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-xl" />
              <div className="pt-3 px-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-[#6C3EF4] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <Link to="/courses" className="text-sm font-medium text-[#6C3EF4] hover:underline">
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}