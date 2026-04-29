import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  CameraOff,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FileText,
  Keyboard,
  LayoutList,
  Loader2,
  MonitorPlay,
  PlayCircle,
  Save,
  Send,
  Sparkles,
  Video,
} from "lucide-react";

import SummaryModal from "../../components/study/SummaryModal";
import QuizModal from "../../components/study/QuizModal";
import { useEmotion } from "../../components/study/EmotionMonitor";
import { aiService, type ChatMessage } from "../../services/ai.service";
import { api } from "../../services/api";

type Lesson = {
  _id?: string;
  id?: string;
  title: string;
  type?: "video" | "pdf" | "voice" | string;
  videoUrl?: string;
  pdfUrl?: string;
  duration?: string;
  durationSec?: number;
};

type CourseModule = {
  _id?: string;
  id?: string;
  title: string;
  lessons?: Lesson[];
};

type Course = {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoDurationSec?: number;
  pdfUrl?: string;
  image?: string;
  level?: string;
  category?: string;
  instructor?: {
    name?: string;
  };
  modules?: CourseModule[];
  lessons?: Lesson[];
};
type Tab = 'overview' | 'notes' | 'modules';

function normalizeUrl(raw?: string) {
  if (!raw) return "";

  const value = raw.trim();

  const markdownUrl = value.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownUrl?.[1]) return markdownUrl[1];

  const angleUrl = value.match(/^<\s*(https?:\/\/[^>]+)\s*>$/);
  if (angleUrl?.[1]) return angleUrl[1];

  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads")) return value;
  if (value.startsWith("uploads")) return `/${value}`;

  return value;
}

function getCourseFromResponse(data: any): Course {
  return data?.course || data?.data || data;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) return false;

  return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}

function buildModules(course: Course): CourseModule[] {
  if (Array.isArray(course.modules) && course.modules.length > 0) {
    return course.modules;
  }

  if (Array.isArray(course.lessons) && course.lessons.length > 0) {
    return [
      {
        id: "course-lessons",
        title: "Course lessons",
        lessons: course.lessons,
      },
    ];
  }

  return [
    {
      id: "main-module",
      title: "Main module",
      lessons: [
        {
          id: course._id,
          title: course.title,
          type: "video",
          videoUrl: course.videoUrl,
          pdfUrl: course.pdfUrl,
          durationSec: course.videoDurationSec,
        },
      ],
    },
  ];
}

function getFlatLessons(modules: CourseModule[]) {
  return modules.flatMap((module, moduleIndex) =>
    (module.lessons || []).map((lesson, lessonIndex) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleIndex,
      lessonIndex,
    })),
  );
}

export default function StudyVideoPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const {
    videoRef: cameraRef,
    emotion,
    error: cameraError,
  } = useEmotion(cameraEnabled);

  const notesKey = useMemo(
    () => `edunova:study-video-notes:${courseId || "unknown"}`,
    [courseId],
  );

  const progressKey = useMemo(
    () => `edunova:study-video-progress:${courseId || "unknown"}`,
    [courseId],
  );

  const completedKey = useMemo(
    () => `edunova:study-video-completed:${courseId || "unknown"}`,
    [courseId],
  );

  const modules = useMemo(() => (course ? buildModules(course) : []), [course]);
  const flatLessons = useMemo(() => getFlatLessons(modules), [modules]);

  const currentLessonIndex = 0;
  const nextLesson = flatLessons[currentLessonIndex + 1];

  const videoUrl =
    normalizeUrl(course?.videoUrl) ||
    normalizeUrl(flatLessons[0]?.videoUrl) ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const progress =
    duration > 0
      ? Math.min(100, Math.round((currentTime / duration) * 100))
      : 0;

  useEffect(() => {
    if (!courseId) {
      setLoadError("Missing course id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    api
      .get(`/courses/${courseId}`)
      .then((res) => {
        setCourse(getCourseFromResponse(res.data));
      })
      .catch(() => {
        setLoadError("Could not load this course. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    setNotes(localStorage.getItem(notesKey) || "");
    setCompleted(localStorage.getItem(completedKey) === "true");
  }, [notesKey, completedKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = Number(localStorage.getItem(progressKey) || 0);

    const handleMetadata = () => {
      setDuration(video.duration || 0);

      if (savedTime > 10 && savedTime < video.duration - 10) {
        video.currentTime = savedTime;
      }
    };

    const handleTime = () => {
      setCurrentTime(video.currentTime);
      localStorage.setItem(progressKey, String(video.currentTime));
    };

    const handleEnded = () => {
      setCompleted(true);
      localStorage.setItem(completedKey, "true");
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("timeupdate", handleTime);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("timeupdate", handleTime);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl, progressKey, completedKey]);

  useEffect(() => {
    if (!course?._id || !cameraEnabled) return;

    const interval = window.setInterval(() => {
      aiService.logEmotion(course._id, emotion);
    }, 15000);

    return () => window.clearInterval(interval);
  }, [course?._id, emotion, cameraEnabled]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const video = videoRef.current;
      if (!video) return;

      if (event.code === "Space") {
        event.preventDefault();
        video.paused ? video.play() : video.pause();
      }

      if (event.key === "ArrowRight") {
        video.currentTime = Math.min(
          video.duration || 0,
          video.currentTime + 10,
        );
      }

      if (event.key === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function saveNotes() {
    localStorage.setItem(notesKey, notes);
    setNotesSaved(true);

    window.setTimeout(() => {
      setNotesSaved(false);
    }, 1500);
  }

  function addTimestampToNotes() {
    const timestamp = `[${formatTime(currentTime)}] `;

    setNotes((value) => `${value}${value ? "\n" : ""}${timestamp}`);
    setActiveTab("notes");
  }

  function markComplete() {
    setCompleted(true);
    localStorage.setItem(completedKey, "true");
  }

  function openSummary() {
    if (!completed) return;
    setShowAiMenu(false);
    setShowSummary(true);
  }

  function openQuiz() {
    if (!completed) return;
    setShowAiMenu(false);
    setShowQuiz(true);
  }

  function goToNextLesson() {
    if (!nextLesson) return;

    if (nextLesson.type === "pdf") {
      navigate(`/study/${courseId}/pdf`);
      return;
    }

    if (nextLesson.type === "voice") {
      navigate(`/study/${courseId}/voice`);
      return;
    }

    navigate(`/study/${courseId}/video`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-4 font-semibold text-slate-700">Loading lesson…</p>
        </div>
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Cannot open lesson
          </h1>

          <p className="mt-3 text-slate-600">
            {loadError || "Course not found."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                Now studying
              </p>

              <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="hidden min-w-[240px] max-w-md flex-1 items-center gap-3 md:flex">
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

          <div className="relative flex shrink-0 items-center gap-3">
            {completed && (
              <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:inline-flex">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}

            <button
              disabled={!completed}
              onClick={() => setShowAiMenu((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${completed
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Tools
              <ChevronDown className="h-4 w-4" />
            </button>

            {showAiMenu && completed && (
              <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200">
                <button
                  onClick={openSummary}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </button>

                <button
                  onClick={openQuiz}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <FileQuestion className="h-4 w-4" />
                  Take Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-1 bg-slate-100 md:hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-6">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="group relative bg-black">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={course.videoPoster || course.image}
                controls
                playsInline
                className="aspect-video w-full bg-black object-contain"
              />

              <button
                onClick={goToNextLesson}
                disabled={!nextLesson}
                className={`absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl shadow-xl opacity-0 transition duration-300 group-hover:opacity-100 ${nextLesson
                    ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700'
                    : 'cursor-not-allowed bg-slate-300 text-slate-500'
                  }`}
                aria-label="Next lesson"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                      </span>
                    ) : (
                      <Badge>In progress</Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-black text-slate-950 md:text-3xl">
                    {course.title}
                  </h1>

                  {course.instructor?.name && (
                    <p className="mt-2 text-sm text-slate-500">
                      Instructor: {course.instructor.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={addTimestampToNotes}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                  >
                    <FileText className="h-4 w-4" />
                    Add timestamp note
                  </button>

                  {!completed && (
                    <button
                      onClick={markComplete}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"> */}
          {/* Overview / Notes */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<BookOpen />}
              >
                Overview
              </TabButton>

              <TabButton
                active={activeTab === 'notes'}
                onClick={() => setActiveTab('notes')}
                icon={<FileText />}
              >
                Notes
              </TabButton>

              <TabButton
                active={activeTab === 'modules'}
                onClick={() => setActiveTab('modules')}
                icon={<LayoutList />}
              >
                Modules & Lessons
              </TabButton>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Overview
                  </h2>

                  <p className="mt-3 leading-8 text-slate-600">
                    {course.description ||
                      'Watch the lesson, take notes, complete the video, then unlock the AI summary and quiz.'}
                  </p>

                  {/* <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <InfoRow
                        icon={<MonitorPlay />}
                        title="Video player"
                        text="Use the video controls for play, pause, speed, volume, seek, and fullscreen."
                      />

                      <InfoRow
                        icon={<Keyboard />}
                        title="Keyboard shortcuts"
                        text="Space: play/pause. Left arrow: back 10 seconds. Right arrow: forward 10 seconds."
                      />

                      <InfoRow
                        icon={<FileText />}
                        title="Notes"
                        text="Save personal notes and add timestamps from the current video time."
                      />

                      <InfoRow
                        icon={<Sparkles />}
                        title="AI tools"
                        text="Summary and quiz unlock after you complete the lesson."
                      />

                      <InfoRow
                        icon={<Camera />}
                        title="Focus camera"
                        text="Optional. Turn it on from the side panel if you want focus detection."
                      />

                      <InfoRow
                        icon={<PlayCircle />}
                        title="Next lesson"
                        text="Use the arrow button on the video frame to continue."
                      />
                    </div> */}
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Personal notes
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Notes are saved locally in your browser.
                      </p>
                    </div>

                    <button
                      onClick={saveNotes}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                    >
                      {notesSaved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save notes
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Write your notes here..."
                    className="min-h-[300px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </div>
              )}

              {activeTab === 'modules' && (
                <div>
                  <div className="mb-5 flex items-center gap-2">
                    <LayoutList className="h-5 w-5 text-indigo-600" />

                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Modules & Lessons
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Follow the course structure and continue through each lesson.
                      </p>
                    </div>
                  </div>

                  <ModulesList
                    modules={modules}
                    currentLessonIndex={currentLessonIndex}
                  />
                </div>
              )}
            </div>
          </div>
          {/* </div> */}
        </section>

        <aside className="grid min-h-0 gap-6 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:grid-rows-2 lg:self-start">
          <TutorPanel
            courseId={course._id}
            courseTitle={course.title}
            extraContext={`Video time: ${formatTime(
              currentTime,
            )}. Progress: ${progress}%. Completed: ${completed}. ${cameraEnabled ? `Focus state: ${emotion}.` : ""
              }`}
          />

          <FocusCameraCard
            cameraEnabled={cameraEnabled}
            cameraRef={cameraRef}
            emotion={emotion}
            cameraError={cameraError}
            onToggleCamera={() => setCameraEnabled((value) => !value)}
          />
        </aside>
      </main>

      {showSummary && (
        <SummaryModal
          courseId={course._id}
          courseTitle={course.title}
          onClose={() => setShowSummary(false)}
        />
      )}

      {showQuiz && (
        <QuizModal
          courseId={course._id}
          courseTitle={course.title}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}

function TutorPanel({
  courseId,
  courseTitle,
  extraContext,
}: {
  courseId: string;
  courseTitle: string;
  extraContext?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI tutor for "${courseTitle}". Ask me anything about this course.`,
      at: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      at: Date.now(),
    };

    setMessages((current) => [...current, userMsg]);
    setInput("");
    setSending(true);

    try {
      const reply = await aiService.chat(
        courseId,
        [...messages, userMsg],
        text + (extraContext ? `\n[ctx: ${extraContext}]` : ""),
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: reply,
          at: Date.now(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I had trouble answering that. Try again.",
          at: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 bg-indigo-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black text-slate-950">AI Tutor</h2>
            <p className="text-sm text-slate-500">
              Ask anything about this course
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.at}-${index}`}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${isUser
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-800"
                  }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") send();
            }}
            placeholder="Ask about this lesson…"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      {children}
    </span>
  );
}

function TabButton({
  children,
  icon,
  active,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${active
        ? "bg-indigo-600 text-white"
        : "bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
        }`}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {children}
    </button>
  );
}

function InfoRow({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 inline-flex rounded-lg bg-indigo-100 p-2 text-indigo-700 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <p className="font-black text-slate-950">{title}</p>

      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 shrink-0 font-black text-slate-950">{title}</h2>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

function ModulesList({
  modules,
  currentLessonIndex,
}: {
  modules: CourseModule[];
  currentLessonIndex: number;
}) {
  let lessonCounter = 0;

  return (
    <div className="space-y-4">
      {modules.map((module, moduleIndex) => (
        <div key={module._id || module.id || moduleIndex}>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {module.title}
          </p>

          <div className="space-y-2">
            {(module.lessons || []).map((lesson, lessonIndex) => {
              const index = lessonCounter++;
              const active = index === currentLessonIndex;

              return (
                <div
                  key={
                    lesson._id || lesson.id || `${moduleIndex}-${lessonIndex}`
                  }
                  className={`rounded-xl border p-3 ${active
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-slate-200 bg-white"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${active
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-bold text-slate-800">
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold capitalize text-slate-500">
                        {lesson.type || "video"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function FocusCameraCard({
  cameraEnabled,
  cameraRef,
  emotion,
  cameraError,
  onToggleCamera,
}: {
  cameraEnabled: boolean;
  cameraRef: React.RefObject<HTMLVideoElement | null>;
  emotion: string;
  cameraError?: string | null;
  onToggleCamera: () => void;
}) {
  const emotionMeta = getEmotionMeta(emotion);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-0 flex-1 flex-col p-5">
        {cameraEnabled ? (
          <>
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
              <video
                ref={cameraRef}
                muted
                playsInline
                className="h-44 w-full object-cover"
              />

              <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </div>
            </div>

            {/* <div
              className={`mt-4 rounded-xl border p-4 ${emotionMeta.cardClass}`}
            > */}
            <div className="flex items-center justify-between gap-4">
              <div>
                {/* <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">
                    Current focus
                  </p> */}

                <p className="mt-1 text-xl font-black capitalize">
                  {emotionMeta.label}
                </p>
              </div>

              {/* <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-sm">
                  {emotionMeta.emoji}
                </div> */}
            </div>

            <p className="mt-3 text-sm font-medium leading-6 opacity-80">
              {emotionMeta.message}
            </p>
            {/* </div> */}
          </>
        ) : (
          <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-500 shadow-sm">
              <CameraOff className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-slate-950">
              Camera is off
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Turn it on only when you want focus detection. Nothing is shown
              while the camera is disabled.
            </p>
          </div>
        )}

        {cameraError && (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-700">
            {cameraError}
          </div>
        )}

        <button
          onClick={onToggleCamera}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${cameraEnabled
            ? 'border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
            }`}
        >
          {cameraEnabled ? (
            <>
              <CameraOff className="h-4 w-4" />
              Turn camera off
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Turn camera on
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function getEmotionMeta(emotion: string) {
  switch (emotion) {
    case 'engaged':
      return {
        label: 'Engaged',
        emoji: '🔥',
        cardClass: 'border-emerald-100 bg-emerald-50 text-emerald-800',
        message: 'Great focus. Keep going and continue the lesson.',
      };

    case 'confident':
      return {
        label: 'Confident',
        emoji: '⚡',
        cardClass: 'border-indigo-100 bg-indigo-50 text-indigo-800',
        message: 'Nice rhythm. You may be ready to continue or take the quiz.',
      };

    case 'confused':
      return {
        label: 'Confused',
        emoji: '💡',
        cardClass: 'border-amber-100 bg-amber-50 text-amber-800',
        message: 'Try pausing the video and asking the AI Tutor to explain.',
      };

    case 'frustrated':
      return {
        label: 'Frustrated',
        emoji: '🌿',
        cardClass: 'border-rose-100 bg-rose-50 text-rose-800',
        message: 'Take a short break, then replay the difficult part slowly.',
      };

    default:
      return {
        label: 'Neutral',
        emoji: '🙂',
        cardClass: 'border-slate-100 bg-slate-50 text-slate-800',
        message: 'You are in a neutral state. Keep watching or ask a question.',
      };
  }
}
