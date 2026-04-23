import { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Question = {
    id: number;
    text: string;
    type: 'multi' | 'single';
    options: { id: string; text: string }[];
    correctIds: string[];
    explanations?: Record<string, string>;
    userAnswer?: string[];
    points: number;
    earned: number;
};

export default function QuizPage() {
    const navigate = useNavigate();
    const [questions] = useState<Question[]>([
        {
            id: 1,
            text: 'Which of the following can address overfitting?',
            type: 'multi',
            options: [
                { id: 'a', text: 'Apply regularization' },
                { id: 'b', text: 'Select a subset of the more relevant features.' },
                { id: 'c', text: 'Remove a random set of training examples' },
                { id: 'd', text: 'Collect more training data' },
            ],
            correctIds: ['a', 'b', 'd'],
            explanations: {
                a: 'Regularization is used to reduce overfitting.',
                b: 'Training on more relevant features helps the model generalize better to new examples.',
                d: 'More training data usually helps the model generalize better.',
            },
            userAnswer: ['a', 'b', 'd'],
            points: 1,
            earned: 1,
        },
        {
            id: 2,
            text: 'You fit logistic regression with polynomial features to a dataset, and your model looks like this. What would you conclude?',
            type: 'single',
            options: [
                { id: 'a', text: 'The model has high variance (overfitting). Getting more training data would likely help.' },
                { id: 'b', text: 'The model has high bias (underfitting). Adding more features would help.' },
                { id: 'c', text: 'The model is performing well. No changes needed.' },
                { id: 'd', text: 'The model has high variance. Reducing the number of features would help.' },
            ],
            correctIds: ['a'],
            userAnswer: ['a'],
            points: 1,
            earned: 1,
        },
    ]);

    const totalEarned = questions.reduce((s, q) => s + q.earned, 0);
    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    const percent = Math.round((totalEarned / totalPoints) * 100);
    const passed = percent >= 70;

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Gradient banner */}
            <div className="h-48 bg-gradient-to-r from-[#6C3EF4] via-[#8B5CF6] to-[#EC4899]">
                <div className="max-w-4xl mx-auto px-6 h-full flex items-center">
                    <div>
                        <button
                            onClick={() => navigate('/learn')}
                            className="flex items-center gap-2 text-white/90 hover:text-white text-sm mb-3 transition"
                        >
                            <ArrowLeft size={16} /> Back to lesson
                        </button>
                        <p className="text-white/80 text-sm uppercase tracking-wider">Graded Assignment</p>
                        <h1 className="text-white text-3xl font-bold mt-1">
                            Practice quiz: The problem of overfitting
                        </h1>
                        <div className="flex items-center gap-4 mt-3 text-sm text-white/90">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> 30 min</span>
                            <span>·</span>
                            <span>Due Jan 10, 8:59 AM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-16 space-y-6">
                {/* Score card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            passed
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                                : 'bg-gradient-to-br from-red-400 to-red-600'
                        }`}>
                            <span className="text-white text-2xl font-bold">{percent}%</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {passed ? (
                                    <>
                                        <Award className="text-[#6C3EF4]" size={22} />
                                        <h2 className="text-xl font-bold text-gray-900">Congratulations! You passed!</h2>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="text-red-500" size={22} />
                                        <h2 className="text-xl font-bold text-gray-900">Keep trying — you'll get it!</h2>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-600">
                                You scored <span className="font-bold text-gray-900">{totalEarned} / {totalPoints}</span> points.
                                {passed && " Great job — you've earned 50 points!"}
                            </p>
                        </div>
                        {passed && (
                            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-full">
                                <Star size={16} fill="#f59e0b" className="text-yellow-500" />
                                <span className="text-sm font-semibold text-yellow-700">+50 points</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Questions */}
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="flex items-start justify-between mb-6 gap-4">
                            <div className="flex gap-3 flex-1">
                                <span className="w-8 h-8 rounded-full bg-[#6C3EF4]/10 text-[#6C3EF4] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="text-gray-900 font-semibold text-lg leading-snug pt-0.5">
                                    {q.text}
                                </p>
                            </div>
                            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                                q.earned === q.points
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {q.earned} / {q.points} point{q.points > 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-3 ml-11">
                            {q.options.map(opt => {
                                const selected = q.userAnswer?.includes(opt.id);
                                const correct = q.correctIds.includes(opt.id);
                                const showCorrectExplanation = selected && correct && q.explanations?.[opt.id];

                                return (
                                    <div key={opt.id}>
                                        <div className={`flex items-start gap-3 p-4 rounded-xl border transition ${
                                            selected && correct
                                                ? 'bg-green-50 border-green-200'
                                                : selected && !correct
                                                ? 'bg-red-50 border-red-200'
                                                : !selected && correct
                                                ? 'bg-blue-50/50 border-blue-200'
                                                : 'bg-gray-50 border-gray-200'
                                        }`}>
                                            <div className="mt-0.5 shrink-0">
                                                {q.type === 'multi' ? (
                                                    selected ? (
                                                        <div className="w-5 h-5 rounded bg-[#6C3EF4] flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white" />
                                                    )
                                                ) : (
                                                    selected ? (
                                                        <div className="w-5 h-5 rounded-full border-2 border-[#6C3EF4] flex items-center justify-center bg-white">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#6C3EF4]" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                                                    )
                                                )}
                                            </div>
                                            <span className="text-gray-800 leading-relaxed flex-1">{opt.text}</span>
                                            {selected && correct && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
                                            {selected && !correct && <XCircle size={18} className="text-red-600 shrink-0" />}
                                        </div>

                                        {showCorrectExplanation && (
                                            <div className="mt-2 ml-1 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                                                <div className="flex items-center gap-2 mb-1 text-green-700 font-semibold text-sm">
                                                    <CheckCircle2 size={16} /> Correct
                                                </div>
                                                <p className="text-sm text-green-900">{q.explanations![opt.id]}</p>
                                            </div>
                                        )}

                                        {!selected && correct && (
                                            <p className="mt-1.5 ml-1 text-xs text-blue-600 italic">
                                                This was also a correct answer
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/learn')}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                    >
                        Back to course
                    </button>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 border border-[#6C3EF4] text-[#6C3EF4] rounded-lg font-medium hover:bg-[#6C3EF4]/5 transition text-sm">
                            Retake quiz
                        </button>
                        <button className="px-5 py-2.5 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#6C3EF4] transition text-sm font-semibold flex items-center gap-2">
                            Next lesson →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}