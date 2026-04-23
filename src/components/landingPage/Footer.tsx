import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Logo from '../../assets/landingPage/Logo.png';

const Footer = (): React.JSX.Element => {
  return (
    <footer className="bg-indigo-950 text-white pt-16 ">
      <div className="container grid md:grid-cols-[1fr_2fr] gap-16 pb-16 px-6">

        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-bold text-2xl text-white mb-6">
            {/* <div className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg text-xl">U</div> */}
            <img src={Logo} alt="logo" />
            <span className="logo-text">EduNova Ai</span>
          </div>
          <p className="text-indigo-200 mb-6 leading-relaxed">
            Learn from the best and master your skills with EduNova Ai. Join our community of learners today.
          </p>
          <div className="flex gap-4">
             <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-primary"><Facebook size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-primary"><Twitter size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-primary"><Linkedin size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-primary"><Instagram size={20}/></a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
                <h4 className="text-lg font-bold mb-6">Company</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">About Us</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Careers</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Press</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Blog</a></li>
                </ul>
            </div>

             <div>
                <h4 className="text-lg font-bold mb-6">Community</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Team Plans</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Refer a Friend</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Limited Memberships</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Scholarships</a></li>
                </ul>
            </div>

             <div>
                <h4 className="text-lg font-bold mb-6">Support</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Terms &amp; Conditions</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">FAQ</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">Contact Us</a></li>
                </ul>
            </div>
        </div>

      </div>

      <div className="bg-[#17153b] py-6 text-center text-slate-400 text-sm">
          <div className="container">
              <p>&copy; {new Date().getFullYear()} EduNova Ai. All rights reserved.</p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
