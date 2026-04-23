import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cartService } from '../../services/cart.service';
import { wishlistService } from '../../services/wishlist.service';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export interface CourseProps {
    id: string;
    title: string;
    category: string;
    level: string;
    instructor: string;
    price: number;
    oldPrice?: number;
    rating: number;
    image: string;
    isWishlisted?: boolean;
}

export function CourseCard({ course, className }: { course: CourseProps; className?: string }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wishlisted, setWishlisted] = useState(!!course.isWishlisted);

    const requireAuth = (): boolean => {
        if (!user) {
            toast.error('Please login first');
            navigate('/login');
            return false;
        }
        return true;
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        try {
            await cartService.add(course.id);
            toast.success(`${course.title.slice(0, 30)}… added to cart`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        try {
            const { data }: any = await wishlistService.toggle(course.id);
            setWishlisted(data.data.wishlisted);
            toast.success(data.data.wishlisted ? 'Added to wishlist' : 'Removed from wishlist');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update wishlist');
        }
    };

    return (
        <div
            onClick={() => navigate(`/course/${course.id}`)}
            className={`group bg-white rounded-[2rem] p-4 border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${className || 'min-w-[280px] sm:min-w-[320px]'}`}
        >
            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 flex-shrink-0">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#ff4757' : 'none'} stroke={wishlisted ? '#ff4757' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                <div className="absolute bottom-3 right-3 flex items-center gap-0.5 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-lg">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={10} fill={i <= Math.round(course.rating) ? '#f59e0b' : 'none'} className={i <= Math.round(course.rating) ? 'text-amber-500' : 'text-gray-400'} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-50 text-indigo-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">{course.category}</span>
                    <span className="bg-orange-50 text-orange-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">{course.level}</span>
                </div>

                <h3 className="font-bold text-slate-700 text-sm mb-3 line-clamp-2 leading-tight">{course.title}</h3>

                <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-[10px] font-semibold text-gray-400">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                        <span className="font-black text-indigo-600 text-lg">₹ {course.price}</span>
                        {course.oldPrice && <span className="text-sm font-bold text-gray-300 line-through">₹ {course.oldPrice}</span>}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}