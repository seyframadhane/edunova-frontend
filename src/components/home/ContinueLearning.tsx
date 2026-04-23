import { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { enrollmentService } from '../../services/enrollment.service';

interface Enrollment {
    _id: string;
    progress: number;
    course: {
        _id: string;
        title: string;
        image: string;
        category: string;
        level: string;
        unitsCount: number;
        modulesCount: number;
    };
}

export function ContinueLearning() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    useEffect(() => {
        enrollmentService.mine()
            .then(({ data }: any) => setEnrollments(data.data))
            .catch(() => setEnrollments([]));
    }, []);

    if (enrollments.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.slice(0, 2).map((e) => (
                    <div key={e._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                            <img src={e.course.image} alt={e.course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="text-white" size={32} />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded">{e.course.category}</span>
                                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{e.course.level}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 line-clamp-1">{e.course.title}</h3>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{e.course.unitsCount} Units • {e.course.modulesCount} Modules</span>
                                    <span>{e.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${e.progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}