import React from 'react';
import { ArrowRight } from 'lucide-react';
import Landing_Page_Hero_1 from "../../assets/landingPage/Landing_Page_Hero_1.png";
import User_img_1 from "../../assets/landingPage/User_img_1.png";
import User_img_2 from "../../assets/landingPage/User_img_2.png";
import User_img_3 from "../../assets/landingPage/User_img_3.png";

const Hero = (): React.JSX.Element => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden px-6">
      <div className="container grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            A new way of <span className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-3 after:bg-primary/20 after:-z-10 after:rounded">Learning</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-lg">
            Unleash your potential with our immersive learning platform. Learn from the best, at your own pace, and correct your career trajectory.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <button className="btn btn-primary px-8 py-3 text-lg">
              Join now <ArrowRight size={18} />
            </button>
            <div className="flex items-center gap-4">
                {/* Placeholders for avatars */}
                <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300">
                        <img src={User_img_1} alt="User Image" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400">
                        <img src={User_img_2} alt="User Image" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-500">
                        <img src={User_img_3} alt="User Image" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col text-sm">
                    <span className="font-bold text-gray-900">10k+</span>
                    <span className="text-gray-500">Students</span>
                </div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="w-full max-w-[500px] aspect-square bg-indigo-100 flex items-center justify-center text-primary font-semibold relative rounded-[50%_50%_40%_40%/60%_60%_40%_40%] overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                  <img src={Landing_Page_Hero_1} alt="Landing Page Hero" className="max-w-full max-h-full object-cover" />
              </div>
          </div>

          {/* Floating cards */}
          <div className="absolute top-[10%] left-0 bg-white p-3 md:p-5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">📚</div>
             <div className="flex flex-col text-sm text-gray-800 leading-tight">
                 <strong>100+</strong>
                 <span>Courses</span>
             </div>
          </div>
           <div className="absolute bottom-[15%] right-0 bg-white p-3 md:p-5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float [animation-delay:1.5s]">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">🎓</div>
             <div className="flex flex-col text-sm text-gray-800 leading-tight">
                 <strong>Expert</strong>
                 <span>Mentors</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
