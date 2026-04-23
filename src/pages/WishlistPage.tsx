import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { wishlistService } from '../services/wishlist.service';
import { CourseCard, type CourseProps } from '../components/ui/CourseCard';

export default function WishlistPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        wishlistService.get()
            .then(({ data }: any) => setItems(data.data))
            .catch(() => toast.error('Failed to load wishlist'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">My Wishlist</h1>
            {items.length === 0 ? (
                <div className="text-center py-20">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
                    <button onClick={() => navigate('/courses')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Browse courses</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(w => {
                        const c = w.course;
                        const card: CourseProps = {
                            id: c._id, title: c.title, category: c.category, level: c.level,
                            instructor: c.instructor?.name || '', price: c.price, oldPrice: c.oldPrice,
                            rating: c.rating, image: c.image, isWishlisted: true,
                        };
                        return <CourseCard key={w._id} course={card} className="w-full" />;
                    })}
                </div>
            )}
        </div>
    );
}