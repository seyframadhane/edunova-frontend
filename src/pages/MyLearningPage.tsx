import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, FileText, Video, Mic, Clock, X } from "lucide-react";
import { enrollmentService } from "../services/enrollment.service";

type Enrollment = {
  _id: string;
  progress: number;
  course: {
    _id: string;
    title: string;
    image: string;
    level?: string;
    durationHours?: number;
  };
};

export default function MyLearningPage() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enrollment | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    enrollmentService
      .mine()
      .then(({ data }: any) => setItems(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const targetId = (location.state as any)?.openStudyForCourseId as string | undefined;
    if (!targetId || items.length === 0) return;

    const match = items.find((e) => e.course._id === targetId);
    if (match) setSelected(match);

    // Clear the state so refreshing the page doesn't reopen the modal
    window.history.replaceState({}, document.title);
  }, [items, location.state]);
  
  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);



  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading…</div>;



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-600 mt-1">
          Pick up where you left off — or jump into a new study mode.
        </p>

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-700 mt-4 text-lg">
              You haven't enrolled in any course yet
            </p>
            <p className="text-gray-500 text-sm">
              Find a course you love and start learning today.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-6 px-6 py-3 bg-[#6C3EF4] text-white rounded-xl font-semibold hover:bg-[#5a30d4] transition"
            >
              Browse courses
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((e) => (
              <button
                key={e._id}
                onClick={() => setSelected(e)}
                className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition overflow-hidden flex flex-col group focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/40"
              >
                <div className="relative">
                  <img
                    src={e.course.image}
                    alt={e.course.title}
                    className="w-full h-40 object-cover group-hover:scale-[1.02] transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    {e.course.level && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {e.course.level}
                      </span>
                    )}
                    {e.course.durationHours && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {e.course.durationHours}h
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#6C3EF4] transition">
                    {e.course.title}
                  </h3>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                      <span>Progress</span>
                      <span className="font-semibold">
                        {e.progress ?? 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6C3EF4] to-[#9b6dff] rounded-full transition-all"
                        style={{ width: `${e.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ───────── Study mode modal ───────── */}
      {selected && (
        <StudyModeModal
          enrollment={selected}
          onClose={() => setSelected(null)}
          onPick={(mode) => {
            const id = selected.course._id;
            setSelected(null);
            if (mode === "pdf") navigate(`/study/pdf/${id}`);
            else if (mode === "video") navigate(`/study/video/${id}`);
            else navigate(`/study/voice/${id}`);
          }}
        />
      )}
    </div>
  );
}

/* ───────── Modal component ───────── */

function StudyModeModal({
  enrollment,
  onClose,
  onPick,
}: {
  enrollment: Enrollment;
  onClose: () => void;
  onPick: (mode: "pdf" | "video" | "voice") => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with course image */}
        <div className="relative">
          <img
            src={enrollment.course.image}
            alt={enrollment.course.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {enrollment.course.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h4 className="text-base font-bold text-gray-900">
            Choose how to study
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Pick the learning mode that fits you best.
          </p>

          <div className="mt-5 space-y-3">
            <ModeRow
              icon={<FileText className="w-5 h-5" />}
              title="Study with PDF"
              desc="Read course materials and chat with AI"
              color="from-rose-500 to-rose-600"
              onClick={() => onPick("pdf")}
            />
            <ModeRow
              icon={<Video className="w-5 h-5" />}
              title="Study with Video"
              desc="Watch lessons with emotion-aware tutor"
              color="from-violet-500 to-fuchsia-500"
              onClick={() => onPick("video")}
            />
            <ModeRow
              icon={<Mic className="w-5 h-5" />}
              title="Study with Voice"
              desc="Have a real conversation with the AI tutor"
              color="from-emerald-500 to-teal-500"
              onClick={() => onPick("voice")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeRow({
  icon,
  title,
  desc,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#6C3EF4]/40 hover:bg-[#6C3EF4]/[0.03] transition text-left group"
    >
      <div
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-sm shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 group-hover:text-[#6C3EF4] transition">
          {title}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">{desc}</p>
      </div>
      <span className="text-[#6C3EF4] opacity-0 group-hover:opacity-100 transition text-sm font-semibold">
        Start →
      </span>
    </button>
  );
}