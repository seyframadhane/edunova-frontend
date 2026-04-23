import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { instructorService } from '../../services/instructor.service';

interface Instructor {
    _id: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    coursesCount: number;
}

function Instructors() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    useEffect(() => {
        instructorService.list()
            .then(({ data }) => setInstructors(data.data))
            .catch(console.error);
    }, []);

    return (
        <div className="relative pb-20 bg-gray-50">
            <div className="bg-[#1a1c20] pt-12 pb-36 px-8 sm:px-12 rounded-[2rem] mx-4 mt-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Meet our TOP Instructors</h2>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">See all →</a>
                </div>
            </div>

            <div className="max-w-7xl mx-4 px-10 sm:px-16 -mt-25">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {instructors.map((instructor) => (
                        <div key={instructor._id} className="bg-[#24262b] rounded-2xl overflow-hidden shadow-2xl flex flex-col group border border-white/5">
                            <div className="bg-white aspect-square relative overflow-hidden">
                                <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> {instructor.rating}
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-bold text-base text-white leading-tight">{instructor.name}</h3>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter mt-1">{instructor.role}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{instructor.coursesCount} Courses</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Instructors;