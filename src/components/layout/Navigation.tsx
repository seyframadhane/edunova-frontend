import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, GraduationCap, Heart, ShoppingCart, Settings, Award, LogOut } from 'lucide-react';
import { NavItem } from '../ui/NavItem';
import logoImage from '../../assets/images/Logo.png';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function Navigation() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Logged out');
        navigate('/login');
    };

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-72'} bg-[#1a1c20] text-white flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 z-50 shadow-2xl overflow-hidden`}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
        >
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <div className="flex items-center gap-4 min-w-max">
                    <img src={logoImage} alt="Logo" className="w-15 h-15 object-contain" />
                    <span className={`text-2xl font-bold whitespace-nowrap transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>EduNova AI</span>
                </div>
            </div>

            <nav className="flex-1 flex flex-col pt-4 overflow-x-hidden">
                <NavLink to="/home" end className="block">{({ isActive }) => <NavItem icon={Home} label="Home" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/my-learning" className="block">{({ isActive }) => <NavItem icon={BookOpen} label="My Learning" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/courses" className="block">{({ isActive }) => <NavItem icon={Users} label="Courses" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/certificate" className="block">{({ isActive }) => <NavItem icon={GraduationCap} label="Certificate" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/wishlist" className="block">{({ isActive }) => <NavItem icon={Heart} label="Wishlist" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/cart" className="block">{({ isActive }) => <NavItem icon={ShoppingCart} label="My Cart" active={isActive} isCollapsed={isCollapsed} />}</NavLink>
                <NavLink to="/settings" className="block">{({ isActive }) => <NavItem icon={Settings} label="Settings" active={isActive} isCollapsed={isCollapsed} />}</NavLink>

                <div className="mt-auto border-t border-white/5 pt-4 mb-6">
                    <NavLink to="/become-partner" className="block">{({ isActive }) => <NavItem icon={Award} label="Become Edu Partner" active={isActive} isCollapsed={isCollapsed} isBottom />}</NavLink>
                    <div onClick={handleLogout} className="block cursor-pointer">
                        <NavItem icon={LogOut} label="Logout" isCollapsed={isCollapsed} />
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export default Navigation;