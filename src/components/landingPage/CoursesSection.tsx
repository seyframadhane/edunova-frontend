import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CourseCard, { type Course } from './CourseCard';
import { courseService } from '../../services/course.service';

interface CoursesSectionProps {
    title: string;
    showTabs?: boolean;
}

const CoursesSection = ({ title, showTabs = true }: CoursesSectionProps): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('All');
    const [courses, setCourses] = useState<Course[]>([]);

    const tabs: string[] = ['All', 'Data Science', 'UI/UX Design', 'Web Dev'];

    useEffect(() => {
        const params: Record<string, any> = { limit: 6 };
        if (activeTab !== 'All') params.topic = activeTab;
        courseService.list(params)
            .then(({ data }) => {
                const mapped: Course[] = data.data.map((c: any) => ({
                    id: c._id,
                    category: c.category,
                    title: c.title,
                    instructor: c.instructor?.name || 'Unknown',
                    price: String(c.price),
                    oldPrice: c.oldPrice ? String(c.oldPrice) : undefined,
                    level: c.level,
                    image: c.image,
                }));
                setCourses(mapped);
            })
            .catch(console.error);
    }, [activeTab]);

    return (
        <section className="py-16 bg-gray-50 px-6">
            <div className="container">
                <div className="flex flex-col gap-6 mb-12 items-start md:items-center md:text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    {showTabs && (
                        <div className="flex gap-4 flex-wrap justify-center">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${activeTab === tab ? 'bg-primary text-white border-primary' : 'border-gray-200 bg-white text-gray-500 hover:bg-primary hover:text-white hover:border-primary'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative px-6">
                    <button className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm z-10 text-gray-800 hover:bg-primary hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    <button className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm z-10 text-gray-800 hover:bg-primary hover:text-white transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;