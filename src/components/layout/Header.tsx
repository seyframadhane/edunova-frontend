import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showNotifications]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="pl-4 sm:pl-6 lg:pl-8 pr-10">
        <div className="flex items-center h-16 gap-4">
          {/* Search — takes all available space on the left */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-[#6C3EF4] transition"
              />
            </div>
          </form>

          {/* Far right: bell + avatar */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {user ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="p-2 hover:bg-gray-100 rounded-full transition relative"
                    title="Notifications"
                  >
                    <Bell size={22} className="text-gray-700" />
                  </button>
                  {showNotifications && <NotificationsDropdown />}
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white font-semibold text-sm overflow-hidden hover:ring-2 hover:ring-[#6C3EF4] hover:ring-offset-2 transition"
                  title={fullName}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 bg-[#1a1a2e] text-white rounded-full hover:bg-[#6C3EF4] transition text-sm font-medium"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}