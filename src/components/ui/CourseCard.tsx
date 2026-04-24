import { Star, ShoppingCart, Heart } from 'lucide-react';
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
            className={`group bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col ${className || ''}`}
        >
            {/* Image — 16:9, much shorter */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition"
                >
                    <Heart
                        size={16}
                        className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}
                    />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-semibold">
                        {course.rating?.toFixed(1) ?? '0.0'}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="pt-3 px-1 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-purple-50 text-[#6C3EF4] rounded-full">
                        {course.category}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                        {course.level}
                    </span>
                </div>

                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                    {course.title}
                </h3>

                <p className="text-xs text-gray-500 mb-3">{course.instructor}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-[#6C3EF4]">₹{course.price}</span>
                        {course.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{course.oldPrice}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-8 h-8 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center hover:bg-[#6C3EF4] transition"
                        title="Add to cart"
                    >
                        <ShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}