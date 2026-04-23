import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo_landing_page from '../../assets/landingPage/Logo_landing_page.png';

const Header = (): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white py-4 sticky top-0 z-[1000] shadow-sm px-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
          {/* <div className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg text-xl">U</div>
          <span className="logo-text">EduNova Ai</span> */}
          <img src={Logo_landing_page} alt="logo" />
        </div>

        <nav className={`
            absolute top-full left-0 right-0 bg-white flex-col p-8 gap-6 items-center shadow-md transform transition-transform duration-300 ease-in-out z-[999]
            md:static md:flex md:flex-row md:p-0 md:gap-8 md:shadow-none md:transform-none md:bg-transparent
            ${isMenuOpen ? 'flex translate-y-0' : 'hidden md:flex -translate-y-[150%] md:translate-y-0'}
        `}>
          <a href="/" className="text-gray-500 hover:text-primary font-medium transition-colors duration-300">Courses</a>
          <a href="/" className="text-gray-500 hover:text-primary font-medium transition-colors duration-300">About us</a>
          <a href="/contact" className="text-gray-500 hover:text-primary font-medium transition-colors duration-300">Contact us</a>

          {/* Mobile only actions could go here if needed, but keeping consistent with desktop for now */}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="cursor-pointer p-2 text-gray-500 hover:text-primary">
             <Search size={20} />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
        </div>

        <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
