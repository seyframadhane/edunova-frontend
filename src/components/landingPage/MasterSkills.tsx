import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Landing_Page_img_1 from "../../assets/landingPage/Landing_Page_img_1.png";
import Landing_Page_img_2_1 from "../../assets/landingPage/Landing_Page_img_2-1.png";
import Landing_Page_img_2_2 from "../../assets/landingPage/Landing_Page_img_2-2.png";
import Landing_Page_img_2_3 from "../../assets/landingPage/Landing_Page_img_2-3.png";

const MasterSkills = (): React.JSX.Element => {
  const features: string[] = [
    "Work on real-world projects",
    "Learn from industry experts",
    "Get certified upon completion"
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="container grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center mb-24">

        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
            Master New Skills with <br/>
            <span className="text-primary">Interactive, Guided Courses</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
             Enhance your skills with students learning and mastering various fields in the industry at their own pace.
          </p>

          <div className="flex flex-col gap-4 mb-8 items-center lg:items-start">
             {features.map((item, index) => (
                 <div key={index} className="flex items-center gap-4 font-medium text-lg text-gray-800">
                    <div className="text-secondary flex">
                        <CheckCircle2 size={24} />
                    </div>
                    <span>{item}</span>
                 </div>
             ))}
          </div>

        </div>

        <div className="relative flex justify-center">
             <div className="w-full max-w-[450px] h-[400px] bg-indigo-50 rounded-[2rem_5rem_2rem_2rem] flex items-center justify-center text-primary font-semibold overflow-hidden">
                  <img src={Landing_Page_img_1} alt="Landing Page Master Skills" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-5 left-5 bg-white px-6 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-2 font-bold text-gray-900">
                 <span className="text-xl">🎓</span>
                 <span>Certified</span>
             </div>
        </div>

      </div>

      {/* 3 Column Feature Highlights below */}
      <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-gray-50 p-8 rounded-3xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-100">
            <div className="w-12 h-12 rounded-xl mb-6 bg-blue-100 flex items-center justify-center overflow-hidden">
                <img src={Landing_Page_img_2_1} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Interactive Learning</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">Engage with quizzes and projects to reinforce your knowledge.</p>
            <a href="#" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark">Learn more <ArrowRight size={16}/></a>
         </div>
         <div className="bg-gray-50 p-8 rounded-3xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-100">
            <div className="w-12 h-12 rounded-xl mb-6 bg-pink-100 flex items-center justify-center overflow-hidden">
                <img src={Landing_Page_img_2_2} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Mentors</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">Get guidance from top professionals in the industry.</p>
            <a href="#" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark">Learn more <ArrowRight size={16}/></a>
         </div>
         <div className="bg-gray-50 p-8 rounded-3xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-100">
             <div className="w-12 h-12 rounded-xl mb-6 bg-amber-100 flex items-center justify-center overflow-hidden">
                <img src={Landing_Page_img_2_3} alt="" className="w-full h-full object-cover" />
             </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Career Support</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">We help you build your portfolio and ace your interviews.</p>
            <a href="#" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark">Learn more <ArrowRight size={16}/></a>
         </div>
      </div>
    </section>
  );
};

export default MasterSkills;
