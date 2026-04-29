import { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { instructorService } from '../../services/instructor.service';
import DefaultUserImage from '../../assets/images/default user image.png';

interface Instructor {
  _id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  coursesCount: number;
  bio?: string;
}

export default function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instructorService
      .list()
      .then(({ data }) => setInstructors(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topInstructors = [...instructors]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  return (
    <section className="bg-white py-24">
      <div className="container px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-black text-purple-700">
              <Users className="h-4 w-4" />
              Expert instructors
            </div>

            <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Meet our team
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Top instructors, carefully curated to guide students with clear
              lessons, practical experience, and professional support.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-purple-700"
          >
            View all instructors
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <InstructorsSkeleton />
        ) : topInstructors.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center">
            <p className="font-semibold text-slate-600">
              No instructors available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topInstructors.map((instructor) => (
              <InstructorCard key={instructor._id} instructor={instructor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <article className="group rounded-[1.75rem] border border-slate-100 bg-[#F8FAFC] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-purple-100/70">
      <div className="relative mx-auto mb-5 h-28 w-28">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 p-1">
          <div className="h-full w-full overflow-hidden rounded-full bg-white p-1">
            <img
              src={instructor.image || DefaultUserImage}
              alt={instructor.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="absolute -right-3 bottom-1 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-black text-yellow-500 shadow-md">
          <Star className="h-3.5 w-3.5 fill-current" />
          {instructor.rating?.toFixed(1) ?? '0.0'}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-700">
          {instructor.role}
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">
          {instructor.name}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {instructor.bio ||
            'Professional instructor focused on helping students learn practical skills through clear lessons.'}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600">
          <BookOpen className="h-4 w-4 text-purple-700" />
          {instructor.coursesCount ?? 0} courses
        </div>

        <Link
          to="/courses"
          className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-black text-purple-700 transition hover:text-purple-900"
        >
          View courses
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function InstructorsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[360px] animate-pulse rounded-[1.75rem] bg-slate-100"
        />
      ))}
    </div>
  );
}