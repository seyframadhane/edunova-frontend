import { useState } from 'react';
import {
    ChevronUp, ChevronDown, Play, Pause, Volume2, Settings,
    Maximize, PictureInPicture, Rewind, FastForward,
    CheckCircle2, Circle, FileText, BookOpen, Clock, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CourseLearningPage() {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'transcript' | 'notes' | 'downloads'>('transcript');
    const [weekOpen, setWeekOpen] = useState(true);

    const lessons = [
        { id: 1, title: 'Welcome!', type: 'Video', duration: '3 min', status: 'active', section: 'Welcome to the course!' },
        { id: 2, title: 'Join the forum to ask questions and share ideas!', type: 'Reading', duration: '2 min', status: 'done', section: 'Welcome to the course!' },
        { id: 3, title: 'What is clustering?', type: 'Video', duration: '4 min', status: 'todo', section: 'Clustering' },
        { id: 4, title: 'K-means intuition', type: 'Video', duration: '6 min', status: 'todo', section: 'Clustering' },
        { id: 5, title: 'K-means algorithm', type: 'Video', duration: '9 min', status: 'todo', section: 'Clustering' },
        { id: 6, title: 'Optimization objective', type: 'Video', duration: '11 min', status: 'todo', section: 'Clustering' },
        { id: 7, title: 'Initializing K-means', type: 'Video', duration: '8 min', status: 'todo', section: 'Clustering' },
        { id: 8, title: 'Choosing the number of clusters', type: 'Video', duration: '7 min', status: 'todo', section: 'Clustering' },
    ];

    const grouped = lessons.reduce((acc, l) => {
        (acc[l.section] = acc[l.section] || []).push(l);
        return acc;
    }, {} as Record<string, typeof lessons>);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Gradient banner */}
            <div className="h-40 bg-gradient-to-r from-[#6C3EF4] via-[#8B5CF6] to-[#EC4899] relative">
                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                    <p className="text-white/80 text-sm">Week 1 · Unsupervised learning</p>
                    <h1 className="text-white text-3xl font-bold mt-1">
                        Unsupervised Learning, Recommenders, Reinforcement Learning
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* MAIN */}
                <div className="space-y-6">
                    {/* Video card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="relative aspect-video bg-black group">
                            {/* Poster */}
                            <div className="absolute inset-0 flex">
                                <div className="w-2/5 bg-gradient-to-br from-[#6C3EF4] to-[#4a1fb8] flex flex-col items-center justify-center p-6">
                                    <p className="text-white font-bold text-xl">◉ EduNova</p>
                                    <div className="border-t border-b border-white/40 px-3 py-1 mt-3">
                                        <p className="text-[10px] tracking-widest text-white">LEARNING</p>
                                        <p className="text-[10px] tracking-widest text-center text-white">PATH</p>
                                    </div>
                                    <div className="mt-6 text-5xl">🎓</div>
                                </div>
                                <div className="flex-1 bg-white flex flex-col justify-center px-10">
                                    <h2 className="text-[#6C3EF4] font-bold text-2xl leading-tight">
                                        Unsupervised learning,<br />
                                        recommender systems<br />
                                        and reinforcement learning
                                    </h2>
                                    <p className="text-gray-800 text-4xl font-bold mt-4">Welcome!</p>
                                </div>
                            </div>

                            {/* Play overlay */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                    {isPlaying
                                        ? <Pause size={28} fill="#6C3EF4" className="text-[#6C3EF4]" />
                                        : <Play size={28} fill="#6C3EF4" className="text-[#6C3EF4] ml-1" />}
                                </div>
                            </button>

                            {/* Controls */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="w-full h-1 bg-white/25 rounded-full mb-3 cursor-pointer">
                                    <div className="h-full w-[8%] bg-[#6C3EF4] rounded-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-white text-sm">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                        <button><Rewind size={16} /></button>
                                        <button><FastForward size={16} /></button>
                                        <button><Volume2 size={18} /></button>
                                        <span>0:03 / 3:23</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">1x</span>
                                        <button><Settings size={18} /></button>
                                        <button><PictureInPicture size={16} /></button>
                                        <button><Maximize size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Below video card */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                    <Clock size={14} /> Video · 3 min
                                </p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                                <FileText size={16} /> Save note
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 flex gap-8 mb-6">
                            {(['transcript', 'notes', 'downloads'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm capitalize font-medium transition ${
                                        activeTab === tab
                                            ? 'text-[#6C3EF4] border-b-2 border-[#6C3EF4]'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'transcript' && (
                            <div className="space-y-4">
                                {[
                                    { t: '0:01', text: 'Welcome to this third and final course of this specialization on unsupervised learning, recommender systems, and reinforcement learning.', hl: true },
                                    { t: '0:12', text: "Whereas in the first two courses you learned a lot about supervised learning, in this course we'll learn about some of the other major branches of machine learning." },
                                    { t: '0:28', text: "Unsupervised learning, recommender systems, and reinforcement learning are all extremely powerful techniques driving much of what's happening in AI today." },
                                    { t: '0:45', text: "Let's get started by talking about what unsupervised learning is and why it's so useful." },
                                ].map((row, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-gray-400 text-xs font-mono shrink-0 w-12 pt-0.5">{row.t}</span>
                                        <p className="text-gray-700 leading-relaxed">
                                            {row.hl
                                                ? <span className="bg-[#6C3EF4]/15 text-gray-900 rounded px-1">{row.text}</span>
                                                : row.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="text-center py-10 text-gray-500">
                                <BookOpen size={36} className="mx-auto mb-3 text-gray-300" />
                                <p>You haven't taken any notes yet.</p>
                                <button className="mt-3 px-4 py-2 bg-[#6C3EF4] text-white rounded-lg text-sm hover:bg-[#5a2fd9] transition">
                                    Add note
                                </button>
                            </div>
                        )}

                        {activeTab === 'downloads' && (
                            <div className="text-center py-10 text-gray-500">
                                <FileText size={36} className="mx-auto mb-3 text-gray-300" />
                                <p>No downloads available for this lesson.</p>
                            </div>
                        )}

                        {/* Footer nav */}
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                Language: <span className="text-gray-900 font-medium">English</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/quiz')}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                                >
                                    Take quiz
                                </button>
                                <button className="px-5 py-2.5 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#6C3EF4] transition text-sm font-semibold flex items-center gap-2">
                                    Next lesson →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <aside className="bg-white rounded-2xl shadow-sm h-fit sticky top-24">
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Award size={18} className="text-[#6C3EF4]" />
                                <span className="font-semibold text-gray-900 text-sm">Course progress</span>
                            </div>
                            <span className="text-xs text-gray-500">1 / 8</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-[12%] bg-gradient-to-r from-[#6C3EF4] to-[#EC4899] rounded-full" />
                        </div>
                    </div>

                    <div className="p-5">
                        <button
                            onClick={() => setWeekOpen(!weekOpen)}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <div className="text-left">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Week 1</p>
                                <p className="text-sm font-bold text-gray-900">Unsupervised learning</p>
                            </div>
                            {weekOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                        </button>

                        {weekOpen && (
                            <div className="space-y-5">
                                {Object.entries(grouped).map(([section, items]) => (
                                    <div key={section}>
                                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                                            {section}
                                        </p>
                                        <div className="space-y-1">
                                            {items.map(l => (
                                                <button
                                                    key={l.id}
                                                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition ${
                                                        l.status === 'active'
                                                            ? 'bg-[#6C3EF4]/10 border border-[#6C3EF4]/30'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="mt-0.5 shrink-0">
                                                        {l.status === 'done' ? (
                                                            <CheckCircle2 size={18} className="text-green-500" />
                                                        ) : l.status === 'active' ? (
                                                            <div className="w-4 h-4 rounded-full bg-[#6C3EF4] ring-4 ring-[#6C3EF4]/20" />
                                                        ) : (
                                                            <Circle size={18} className="text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm leading-snug ${
                                                            l.status === 'active' ? 'font-semibold text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                            {l.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {l.type} · {l.duration}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}