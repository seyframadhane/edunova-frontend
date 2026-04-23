import { X, Star, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply?: (filters: Record<string, any>) => void;
}

const TOPICS = ['Cyber Security', 'Development', 'Design', 'Data Science', 'Cloud', 'Business', 'Marketing'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['0-2 Hours', '3-6 Hours', '7-12 Hours', '13+ Hours'];

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
    const [selectedTopics, setSelectedTopics] = useState<string[]>(['Cyber Security']);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<'All' | 'Paid' | 'Free'>('All');
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const clearAll = () => {
        setSelectedTopics([]);
        setSelectedLevels([]);
        setSelectedPrice('All');
        setSelectedRating(null);
        setSelectedDuration(null);
    };

    const handleApply = () => {
        onApply?.({
            topic: selectedTopics[0],
            level: selectedLevels[0],
            price: selectedPrice !== 'All' ? selectedPrice : undefined,
            minRating: selectedRating,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">Filter</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    {/* Topic Section */}
                    <Section title="Topic">
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map(topic => (
                                <Chip
                                    key={topic}
                                    label={topic}
                                    isSelected={selectedTopics.includes(topic)}
                                    onClick={() => toggleSelection(selectedTopics, setSelectedTopics, topic)}
                                />
                            ))}
                        </div>
                    </Section>

                    {/* Price Section */}
                    <Section title="Price">
                        <div className="grid grid-cols-3 gap-3">
                            {(['All', 'Paid', 'Free'] as const).map(price => (
                                <button
                                    key={price}
                                    onClick={() => setSelectedPrice(price)}
                                    className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${selectedPrice === price
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-200'
                                        }`}
                                >
                                    {price}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Course Level Section */}
                    <Section title="Course Level">
                        <div className="space-y-2">
                            {LEVELS.map(level => (
                                <label key={level} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-slate-800">{level}</span>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={selectedLevels.includes(level)}
                                            onChange={() => toggleSelection(selectedLevels, setSelectedLevels, level)}
                                        />
                                        <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedLevels.includes(level)
                                            ? 'bg-indigo-600 border-indigo-600'
                                            : 'bg-white border-gray-300'
                                            }`}>
                                            {selectedLevels.includes(level) && <Check size={14} className="text-white" />}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Section>

                    {/* Ratings Section */}
                    <Section title="Ratings">
                        <div className="space-y-3">
                            {[4.5, 4.0, 3.5, 3.0].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => setSelectedRating(rating)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedRating === rating
                                        ? 'bg-orange-50 border-orange-200 shadow-sm'
                                        : 'bg-white border-gray-100 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i <= Math.floor(rating) ? '#f59e0b' : 'none'}
                                                    className={i <= Math.floor(rating) ? 'text-amber-500' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{rating} & up</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 p-0.5 ${selectedRating === rating ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                                        }`}>
                                        <div className="w-full h-full rounded-full bg-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Duration Section */}
                    <Section title="Duration">
                        <div className="grid grid-cols-2 gap-3">
                            {DURATIONS.map(duration => (
                                <button
                                    key={duration}
                                    onClick={() => setSelectedDuration(duration)}
                                    className={`py-2.5 px-2 rounded-xl text-[12px] font-black border transition-all ${selectedDuration === duration
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-200'
                                        }`}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center gap-4">
                    <button
                        onClick={clearAll}
                        className="flex-1 py-3.5 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-[1.5] py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
            {children}
        </div>
    );
}

function Chip({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSelected
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-200'
                }`}
        >
            {label}
        </button>
    );
}
