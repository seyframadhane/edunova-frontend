import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { CourseCard, type CourseProps } from '../components/ui/CourseCard';
import FilterModal from '../components/courses/FilterModal';
import { courseService } from '../services/course.service';

export default function CoursesPage() {
    const [params, setParams] = useSearchParams();
    const [courses, setCourses] = useState<CourseProps[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const page = Number(params.get('page') || 1);
    const limit = 12;

    useEffect(() => {
        setLoading(true);
        const q: Record<string, any> = { page, limit };
        ['q', 'topic', 'level', 'price', 'minRating'].forEach(k => {
            const v = params.get(k); if (v) q[k] = v;
        });
        courseService.list(q)
            .then(({ data }: any) => {
                const mapped: CourseProps[] = data.data.map((c: any) => ({
                    id: c._id, title: c.title, category: c.category, level: c.level,
                    instructor: c.instructor?.name || 'Unknown',
                    price: c.price, oldPrice: c.oldPrice, rating: c.rating, image: c.image,
                }));
                setCourses(mapped);
                setTotal(data.meta?.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params]);

    const totalPages = Math.ceil(total / limit);
    const changePage = (p: number) => {
        params.set('page', String(p));
        setParams(params);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">All Courses</h1>
                    <p className="text-gray-500 mt-1">{total} course{total !== 1 && 's'} found</p>
                </div>
                <button onClick={() => setShowFilter(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                    <SlidersHorizontal size={18} /> Filter
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-[2rem] h-80 animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No courses match your filters.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(c => <CourseCard key={c.id} course={c} className="w-full" />)}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i} onClick={() => changePage(i + 1)}
                            className={`w-10 h-10 rounded-xl font-bold ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                        >{i + 1}</button>
                    ))}
                </div>
            )}

            <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} onApply={(filters) => {
                const p = new URLSearchParams();
                Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, String(v)); });
                setParams(p);
                setShowFilter(false);
            }} />
        </div>
    );
}