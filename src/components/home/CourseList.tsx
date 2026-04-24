import { useEffect, useState } from 'react';
import { CourseCard, type CourseProps } from '../ui/CourseCard';
import { courseService } from '../../services/course.service';

interface CourseListProps {
    title: string;
    trending?: boolean;
}

function CourseList({ title, trending = false }: CourseListProps) {
    const [courses, setCourses] = useState<CourseProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params: Record<string, any> = { limit: trending ? 3 : 8 };
        if (trending) params.sort = '-rating';

        courseService.list(params)
            .then(({ data }) => {
                const mapped: CourseProps[] = data.data.map((c: any) => ({
                    id: c._id,
                    title: c.title,
                    category: c.category,
                    level: c.level,
                    instructor: c.instructor?.name || 'Unknown',
                    price: c.price,
                    oldPrice: c.oldPrice,
                    rating: c.rating,
                    image: c.image,
                }));
                setCourses(mapped);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [trending]);

    if (loading) {
        return (
            <div className="py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">{title}</h2>
                <div className="flex gap-6 px-4 overflow-x-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[280px] h-80 bg-gray-100 rounded-[2rem] animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (title === 'Trending Courses') {
        return (
            <div className="relative pb-12">
                <div className="bg-[#1a1c20] pt-12 pb-36 px-8 sm:px-12 rounded-[2rem] mx-4 mt-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">See all →</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-4 px-10 sm:px-16 -mt-29">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
                        {courses.slice(0, 3).map((course) => (
                            <div key={course.id}>
                                <CourseCard course={course} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="flex items-center justify-between mb-6 px-4">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <a href="#" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                    See all
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {courses.map((course) => (
                    <div key={course.id} className="snap-center">
                        <CourseCard course={course} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseList;