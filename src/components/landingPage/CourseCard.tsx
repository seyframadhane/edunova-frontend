import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export interface Course {
    id: string;
    category: string;
    title: string;
    instructor: string;
    price: string;
    oldPrice?: string;
    level: string;
    image: string;
}

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps): React.JSX.Element {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/course/${course.id}`)}
            className="group min-w-[280px] sm:min-w-[320px] bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-md">{course.category}</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">{course.level}</span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 min-h-[56px]">
                {course.title}
            </h3>

            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} />
                </div>
                <span className="text-sm font-medium text-gray-600">{course.instructor}</span>

                <div className="ml-auto flex items-center gap-1 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" className="text-gray-300" />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-indigo-600 text-xl">₹ {course.price}</span>
                    {course.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">₹ {course.oldPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
