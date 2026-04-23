import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Users, Star, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '../services/course.service';
import { cartService } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { enrollmentService } from '../services/enrollment.service';
import { reviewService } from '../services/review.service';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        Promise.all([courseService.detail(id), reviewService.forCourse(id)])
            .then(([c, r]: any) => {
                setCourse(c.data.data);
                setReviews(r.data.data);
            })
            .catch(() => toast.error('Failed to load course'))
            .finally(() => setLoading(false));
    }, [id]);

    const requireAuth = () => {
        if (!user) { toast.error('Login required'); navigate('/login'); return false; }
        return true;
    };

    const enroll = async () => {
        if (!requireAuth() || !id) return;
        try {
            await enrollmentService.enroll(id);
            toast.success('Enrolled! Check "My Learning"');
        } catch (e: any) { toast.error(e?.response?.data?.message || 'Enroll failed'); }
    };
    const addCart = async () => {
        if (!requireAuth() || !id) return;
        try { await cartService.add(id); toast.success('Added to cart'); }
        catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    };
    const toggleWish = async () => {
        if (!requireAuth() || !id) return;
        try { const { data }: any = await wishlistService.toggle(id); toast.success(data.data.wishlisted ? 'Wishlisted' : 'Removed'); }
        catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
    if (!course) return <div className="p-8 text-center text-gray-400">Course not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-gray-100">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2 mb-4">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg">{course.category}</span>
                        <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg">{course.level}</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-3">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>

                    <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
                        <span className="flex items-center gap-2"><Clock size={16} /> {course.durationHours}h</span>
                        <span className="flex items-center gap-2"><BookOpen size={16} /> {course.modulesCount} modules</span>
                        <span className="flex items-center gap-2"><Users size={16} /> {course.studentsCount} students</span>
                        <span className="flex items-center gap-2"><Star size={16} fill="#f59e0b" className="text-amber-500" /> {course.rating} ({course.reviewsCount})</span>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h2 className="font-bold text-xl mb-4">Instructor</h2>
                        <div className="flex items-center gap-4">
                            <img src={course.instructor?.image} alt={course.instructor?.name} className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <p className="font-bold">{course.instructor?.name}</p>
                                <p className="text-sm text-gray-500">{course.instructor?.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="font-bold text-xl mb-4">Reviews ({reviews.length})</h2>
                        {reviews.length === 0 ? (
                            <p className="text-gray-400">No reviews yet.</p>
                        ) : reviews.map(r => (
                            <div key={r._id} className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold">{r.user?.firstName} {r.user?.lastName}</p>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < r.rating ? '#f59e0b' : 'none'} className="text-amber-500" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-3xl p-6 border border-gray-100 shadow-lg">
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-black text-indigo-600">₹ {course.price}</span>
                            {course.oldPrice && <span className="text-lg text-gray-400 line-through">₹ {course.oldPrice}</span>}
                        </div>
                        <button onClick={enroll} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 mb-3">Enroll Now</button>
                        <button onClick={addCart} className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-50 mb-3 flex items-center justify-center gap-2">
                            <ShoppingCart size={18} /> Add to Cart
                        </button>
                        <button onClick={toggleWish} className="w-full text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Heart size={18} /> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}