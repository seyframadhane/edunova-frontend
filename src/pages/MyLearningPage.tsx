import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { enrollmentService } from '../services/enrollment.service';

export default function MyLearningPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        enrollmentService.mine()
            .then(({ data }: any) => setItems(data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">My Learning</h1>
            {items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 mb-4">You haven't enrolled in any course yet.</p>
                    <button onClick={() => navigate('/courses')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Browse courses</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(e => (
                        <div key={e._id} onClick={() => navigate(`/learn/course/${e.course._id}`)} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg cursor-pointer">
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 relative">
                                <img src={e.course.image} alt={e.course.title} className="w-full h-full object-cover" />
                                <PlayCircle className="absolute inset-0 m-auto text-white/80" size={48} />
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-2 mb-3">{e.course.title}</h3>
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Progress</span>
                                <span className="font-bold">{e.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
