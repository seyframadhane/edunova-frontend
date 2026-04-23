import { useState } from 'react';
import { Star, LayoutGrid, User } from 'lucide-react';
import partnerBg from '../assets/images/Edupartner_img.png';
import { CourseCard, type CourseProps } from '../components/ui/CourseCard';

const DUMMY_UPLOADED_COURSES: CourseProps[] = [
    {
        id: '1',
        title: 'The Ultimate Beginners Guide to Cloud Computer',
        category: 'Cloud',
        level: 'Intermediate',
        instructor: 'Nick Jane',
        price: 5000,
        oldPrice: 8000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'The Ultimate Beginners Guide to Cloud Computer',
        category: 'Cloud',
        level: 'Intermediate',
        instructor: 'Nick Jane',
        price: 5000,
        oldPrice: 8000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'The Ultimate Beginners Guide to Cloud Computer',
        category: 'Cloud',
        level: 'Intermediate',
        instructor: 'Nick Jane',
        price: 5000,
        oldPrice: 8000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1614064641913-6b7140414f14?q=80&w=2070&auto=format&fit=crop'
    }
];

const DUMMY_FEEDBACK = [
    {
        id: '1',
        title: 'After Effects Motion Graphics Beast',
        reviewer: 'Ansh Sharma',
        time: 'about an hour ago',
        text: 'Access to IBM marketing what is I was looking for and Aaron got me the solution',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'After Effects Motion Graphics Beast',
        reviewer: 'Ansh Sharma',
        time: 'about an hour ago',
        text: 'Access to IBM marketing what is I was looking for and Aaron got me the solution',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'After Effects Motion Graphics Beast',
        reviewer: 'Ansh Sharma',
        time: 'about an hour ago',
        text: 'Access to IBM marketing what is I was looking for and Aaron got me the solution',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
    }
];

export default function EduPartnerPage() {
    const [activeCourseTab, setActiveCourseTab] = useState('Design');
    const [activeFeedbackTab, setActiveFeedbackTab] = useState('Design');

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-4">

                {/* Header Banner & Profile */}
                <div className="relative mb-8 text-center flex flex-col items-center">
                    {/* Banner Image */}
                    <div className="w-full h-40 sm:h-48 rounded-[2rem] overflow-hidden bg-blue-100 shadow-sm relative">
                         <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${partnerBg})` }}
                        />
                         <div className="absolute inset-0 bg-blue-900/10" />
                    </div>

                    {/* Profile Avatar Overlapping */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg -mt-12 sm:-mt-14 relative z-10 flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000&auto=format&fit=crop" alt="Shivam Rawat" className="w-full h-full object-cover" />
                    </div>

                    {/* Profile Info */}
                    <div className="mt-4">
                        <h1 className="text-xl font-bold text-slate-800 mb-2">Shivam Rawat</h1>
                        <div className="flex items-center justify-center gap-1 mb-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Star key={i} size={14} fill="#facc15" className="text-yellow-400" />
                            ))}
                            <Star size={14} className="text-yellow-400" />
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500">
                            <div className="flex items-center gap-1.5 border-r border-gray-200 pr-4">
                                <User size={14} />
                                <span>56 Learners</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <LayoutGrid size={14} />
                                <span>02 Courses</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Uploaded Section */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-slate-700 mb-6">Courses Uploaded</h2>

                    {/* Tabs & Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-8 border-b border-gray-100 flex-1">
                            {['Design', 'Motion Graphics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCourseTab(tab)}
                                    className={`pb-4 text-sm font-bold transition-all relative ${
                                        activeCourseTab === tab ? 'text-slate-800' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {tab}
                                    {activeCourseTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <button className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white shadow-sm flex-shrink-0">
                            <LayoutGrid size={16} />
                            Sort
                        </button>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {DUMMY_UPLOADED_COURSES.map((course) => (
                            <CourseCard key={course.id} course={course} className="w-full" />
                        ))}
                    </div>
                </div>

                {/* Latest Feedback Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-700 mb-6">Latest Feedback</h2>

                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-gray-100 mb-8 max-w-sm">
                        {['Design', 'Motion Graphics'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveFeedbackTab(tab)}
                                className={`pb-4 text-sm font-bold transition-all relative ${
                                    activeFeedbackTab === tab ? 'text-slate-800' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                                {activeFeedbackTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Feedback Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {DUMMY_FEEDBACK.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-4 bg-gray-100">
                                    <img src={feedback.avatar} alt={feedback.reviewer} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-800 mb-1">{feedback.title}</h3>
                                <p className="text-[10px] text-gray-400 mb-1">~{feedback.reviewer}</p>
                                <p className="text-[9px] text-gray-300 font-semibold mb-4">{feedback.time}</p>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px]">
                                    {feedback.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
