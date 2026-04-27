import { useEffect, useState } from 'react';
import { Star, BookOpen, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { instructorService } from '../../services/instructor.service';
import { Section } from '../ui/Section';

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

  const sorted = [...instructors].sort(
    (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  );
  const featured = sorted[0];
  const rest = sorted.slice(1, 5);

  return (
    <Section
      tone="dark"
      eyebrow="Meet our team"
      title="Top instructors, carefully curated"
      description="Practitioners and educators with real-world experience, ready to guide your next step."
      action={
        <Link
          to="/instructors"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          View all instructors
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      {loading ? (
        <InstructorsSkeleton />
      ) : !featured ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-5 auto-rows-fr">
          <FeaturedCard instructor={featured} />
          {rest.map((ins, i) => (
            <CompactCard key={ins._id} instructor={ins} index={i + 2} />
          ))}
        </div>
      )}
    </Section>
  );
}

function FeaturedCard({ instructor }: { instructor: Instructor }) {
  return (
    <Link
      to={`/instructors/${instructor._id}`}
      className="group relative col-span-1 lg:col-span-2 lg:row-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25"
    >
      <div className="absolute inset-0">
        <img
          src={instructor.image}
          alt={instructor.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.04] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/60 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Featured instructor
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-[11px] font-bold text-black">
          <Star size={11} fill="currentColor" />
          {instructor.rating?.toFixed(1) ?? '0.0'}
        </span>
      </div>

      <div className="relative mt-auto p-6 pt-24 sm:pt-32 flex flex-col justify-end min-h-[420px]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary-light font-semibold">
          {instructor.role}
        </p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {instructor.name}
        </h3>
        {instructor.bio && (
          <p className="mt-3 text-sm text-gray-300 leading-relaxed line-clamp-2 max-w-md">
            {instructor.bio}
          </p>
        )}

        <div className="mt-5 flex items-center gap-4 text-sm text-gray-300">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary-light" />
            {instructor.coursesCount} courses
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="text-amber-400" fill="currentColor" />
            {instructor.rating?.toFixed(1) ?? '0.0'} avg rating
          </span>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
          View profile
          <span className="grid place-items-center w-7 h-7 rounded-full bg-white/15 transition-colors group-hover:bg-primary">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompactCard({
  instructor,
  index,
}: {
  instructor: Instructor;
  index: number;
}) {
  return (
    <Link
      to={`/instructors/${instructor._id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={instructor.image}
          alt={instructor.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.05] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 via-[#0F1115]/10 to-transparent" />

        <span className="absolute top-3 left-3 grid place-items-center w-7 h-7 rounded-full bg-white/15 text-white text-[11px] font-bold">
          {String(index).padStart(2, '0')}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-amber-400 px-1.5 py-0.5 text-[11px] font-bold text-black">
          <Star size={10} fill="currentColor" />
          {instructor.rating?.toFixed(1) ?? '0.0'}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary-light font-semibold">
          {instructor.role}
        </p>
        <h3 className="mt-1 font-semibold text-white truncate">
          {instructor.name}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <BookOpen size={12} />
            {instructor.coursesCount} courses
          </span>
          <span className="inline-flex items-center gap-1 text-gray-300 transition-colors group-hover:text-white">
            Profile <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function InstructorsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-5 auto-rows-fr">
      <div className="lg:col-span-2 lg:row-span-2 rounded-3xl bg-white/5 animate-pulse min-h-[420px]" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-white/5 animate-pulse h-64" />
      ))}
    </div>
  );
}