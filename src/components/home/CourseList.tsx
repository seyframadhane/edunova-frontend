import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CourseCard, type CourseProps } from '../ui/CourseCard';
import { courseService } from '../../services/course.service';
import { Section } from '../ui/Section';

interface CourseListProps {
  title: string;
  trending?: boolean;
}

export default function CourseList({
  title,
  trending = false,
}: CourseListProps) {
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, any> = { limit: trending ? 3 : 8 };
    if (trending) params.sort = '-rating';

    courseService
      .list(params)
      .then(({ data }) => {
        setCourses(
          data.data.map((c: any) => ({
            id: c._id,
            title: c.title,
            category: c.category,
            level: c.level,
            instructor: c.instructor?.name || 'Unknown',
            price: c.price,
            oldPrice: c.oldPrice,
            rating: c.rating,
            image: c.image,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [trending]);

  const action = (
    <Link
      to="/courses"
      className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
        trending
          ? 'text-gray-300 hover:text-white'
          : 'text-primary hover:underline'
      }`}
    >
      See all <ArrowRight size={14} />
    </Link>
  );

  if (loading) {
    return (
      <Section tone={trending ? 'dark' : 'light'} title={title} action={action}>
        <div
          className={`grid gap-6 ${
            trending
              ? 'md:grid-cols-3'
              : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {Array.from({ length: trending ? 3 : 4 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl animate-pulse ${
                trending ? 'bg-white/5 h-72' : 'bg-gray-100 h-72'
              }`}
            />
          ))}
        </div>
      </Section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <Section
      tone={trending ? 'dark' : 'light'}
      eyebrow={trending ? 'Spotlight' : undefined}
      title={title}
      description={
        trending ? 'The most-loved courses on EduNova right now.' : undefined
      }
      action={action}
    >
      <div
        className={`grid gap-6 ${
          trending
            ? 'md:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {courses.slice(0, trending ? 3 : 8).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </Section>
  );
}