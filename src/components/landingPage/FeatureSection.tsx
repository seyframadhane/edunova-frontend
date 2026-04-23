import React from 'react';
import { ArrowRight } from 'lucide-react';
import Landing_Page_Hero_2 from "../../assets/landingPage/Landing_Page_Hero_2.png";

const FeatureSection = (): React.JSX.Element => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="container flex flex-col-reverse md:grid md:grid-cols-2 gap-16 items-center">

        <div className="relative flex justify-center w-full">
             <img src={Landing_Page_Hero_2} alt="Landing Page Feature" className="w-full max-w-[500px] z-10 relative shadow-2xl rounded-3xl" />
             {/* Decorative element */}
             <div className="blob-decoration"></div>
        </div>

        <div className="max-w-lg text-center md:text-left mx-auto md:mx-0">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight uppercase">
            STAY AHEAD <span className="font-light block text-3xl normal-case mt-2">of the curve</span>
          </h2>
          <p className="text-gray-500 mb-8 text-base leading-relaxed">
            Stay ahead of the curve with our latest tech courses at ULearnmix. Explore cutting-edge topics and master skills demanded by today's dynamic tech industry.
          </p>
          <button className="btn btn-primary">
            Get Started <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;
