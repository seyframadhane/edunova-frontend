import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  FileQuestion,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type StudyHeaderProps = {
  courseTitle: string;
  progress?: number;
  completed?: boolean;
  onSummary: () => void;
  onQuiz: () => void;
};

export default function StudyHeader({
  courseTitle,
  progress = 0,
  completed = false,
  onSummary,
  onQuiz,
}: StudyHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={handleBack}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Now studying
            </p>

            <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">
              {courseTitle}
            </h1>
          </div>
        </div>

        <div className="hidden min-w-[240px] flex-1 max-w-md items-center gap-3 md:flex">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="w-12 text-right text-sm font-black text-slate-700">
            {progress}%
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {completed && (
            <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:inline-flex">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
          )}

          <div className="group relative">
            <button
              disabled={!completed}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                completed
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Tools
              <ChevronDown className="h-4 w-4" />
            </button>

            {completed && (
              <div className="invisible absolute right-0 top-full mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl shadow-slate-200 transition group-hover:visible group-hover:opacity-100">
                <button
                  onClick={onSummary}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </button>

                <button
                  onClick={onQuiz}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <FileQuestion className="h-4 w-4" />
                  Take Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-1 bg-slate-100 md:hidden">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}