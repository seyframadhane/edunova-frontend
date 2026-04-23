import { ArrowRight } from 'lucide-react';
import frameImage from '../../assets/images/Frame 1274.png';

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-12 mb-10">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-8">

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1a1c20] leading-[1.1]">
            Upgrade your skill for better <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase">FUTURE</span>
          </h1>

          <div className="relative py-4">
            {/* Simple representation of the curved text, or just styled text */}
            <div className="flex items-center gap-8 text-lg font-medium text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Explore</span>
              </div>
              {/* Dashed line simulation */}
              <div className="h-px w-12 bg-gray-300 border-t border-dashed"></div>

              <div className="flex flex-col items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Learn</span>
              </div>
              {/* Dashed line simulation */}
              <div className="h-px w-12 bg-gray-300 border-t border-dashed"></div>

              <div className="flex flex-col items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Grow</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="px-8 py-4 bg-[#1a1c20] text-white rounded-full font-bold hover:bg-gray-900 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 flex items-center gap-2">
              Start Learning Now
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowRight size={16} />
              </div>
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all hover:border-gray-300">
              Explore Courses
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden`}>
                  <img src={`https://randomuser.me/api/portraits/thumb/men/${10 + i}.jpg`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-gray-900">10k+ <span className="text-gray-500 font-normal">Active Students</span></p>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-lg lg:max-w-xl flex justify-center lg:justify-end mt-10 lg:mt-0">
          {/* Background Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter opacity-70 "></div> {/* blur-xl animate-blob */}
          <div className="absolute -bottom-0 right-5 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter opacity-70 "></div> {/* animate-blob animation-delay-2000 */}

          {/* Floating Icons */}
          {/* Trophy - Top Left */}
          {/* <div className="absolute top-10 left-10 bg-white p-3 rounded-full shadow-lg z-20 animate-bounce duration-[3000ms]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div> */}

          {/* Lightbulb - Top Right */}
          {/* <div className="absolute top-20 -right-4 bg-white p-3 rounded-full shadow-lg z-20 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.4 1.5-3.8 0-3.3-2.7-6-6-6 0 0-6 2-6 6 0 1.4.5 2.8 1.5 3.8.8.8 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div> */}

          {/* Badge - Mid Left */}
          {/* <div className="absolute bottom-40 left-0 bg-white p-3 rounded-full shadow-lg z-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.74Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div> */}

          {/* Chart - Mid Right */}
          {/* <div className="absolute bottom-20 -right-8 bg-white p-3 rounded-full shadow-lg z-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div> */}

          <div className="relative z-10 w-full">
            <img
              src={frameImage}
              alt="Upgrade your future"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
