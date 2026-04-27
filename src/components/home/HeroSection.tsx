import { ArrowRight, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import frameImage from '../../assets/images/Frame 1274.png';

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative glows — smaller blur radius, fewer composited layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full bg-amber-200/25 blur-2xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              New: AI study companion is live
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#0F1115]">
              Upgrade your skills for a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                better future
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Learn from world-class instructors with hands-on courses,
              certificates, and an AI tutor that adapts to how you study.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/my-learning"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0F1115] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Start Learning Now
                <span className="grid place-items-center w-6 h-6 rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={14} />
                </span>
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <PlayCircle size={18} className="text-primary" />
                Explore Courses
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/thumb/men/${10 + i}.jpg`}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-gray-900">
                    4.9
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Loved by 10k+ active students
                </span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-white to-amber-100/40 blur-2xl" />
              <img
                src={frameImage}
                alt="Upgrade your future"
                width={520}
                height={520}
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;