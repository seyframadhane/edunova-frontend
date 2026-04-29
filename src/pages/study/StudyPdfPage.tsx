import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileQuestion,
  FileText,
  Keyboard,
  LayoutList,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Save,
  Send,
  Sparkles,
  ZoomIn,
} from 'lucide-react';

import SummaryModal from '../../components/study/SummaryModal';
import QuizModal from '../../components/study/QuizModal';
import { aiService, type ChatMessage } from '../../services/ai.service';
import { api } from '../../services/api';

type Lesson = {
  _id?: string;
  id?: string;
  title: string;
  type?: 'video' | 'pdf' | 'voice' | string;
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
  pdfUrl?: string;
  videoUrl?: string;
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
  if (!raw) return '';

  const value = raw.trim();

  const markdownUrl = value.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownUrl?.[1]) return markdownUrl[1];

  const angleUrl = value.match(/^<\s*(https?:\/\/[^>]+)\s*>$/);
  if (angleUrl?.[1]) return angleUrl[1];

  if (value.startsWith('http')) return value;
  if (value.startsWith('/uploads')) return value;
  if (value.startsWith('uploads')) return `/${value}`;

  return value;
}

function getCourseFromResponse(data: any): Course {
  return data?.course || data?.data || data;
}

function buildModules(course: Course): CourseModule[] {
  if (Array.isArray(course.modules) && course.modules.length > 0) {
    return course.modules;
  }

  if (Array.isArray(course.lessons) && course.lessons.length > 0) {
    return [
      {
        id: 'course-lessons',
        title: 'Course lessons',
        lessons: course.lessons,
      },
    ];
  }

  return [
    {
      id: 'main-module',
      title: 'Main module',
      lessons: [
        {
          id: course._id,
          title: course.title,
          type: 'pdf',
          pdfUrl: course.pdfUrl,
          videoUrl: course.videoUrl,
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
    }))
  );
}

export default function StudyPdfPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const pdfFrameRef = useRef<HTMLIFrameElement | null>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [completed, setCompleted] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const [zoom, setZoom] = useState(100);

  const notesKey = useMemo(
    () => `edunova:study-pdf-notes:${courseId || 'unknown'}`,
    [courseId]
  );

  const completedKey = useMemo(
    () => `edunova:study-pdf-completed:${courseId || 'unknown'}`,
    [courseId]
  );

  const progressKey = useMemo(
    () => `edunova:study-pdf-progress:${courseId || 'unknown'}`,
    [courseId]
  );

  const modules = useMemo(() => (course ? buildModules(course) : []), [course]);
  const flatLessons = useMemo(() => getFlatLessons(modules), [modules]);

  const currentLessonIndex = 0;
  const nextLesson = flatLessons[currentLessonIndex + 1];

  const pdfUrl =
    normalizeUrl(course?.pdfUrl) || normalizeUrl(flatLessons[0]?.pdfUrl);

  useEffect(() => {
    if (!courseId) {
      setLoadError('Missing course id.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError('');

    api
      .get(`/courses/${courseId}`)
      .then((res) => {
        setCourse(getCourseFromResponse(res.data));
      })
      .catch(() => {
        setLoadError('Could not load this course. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    setNotes(localStorage.getItem(notesKey) || '');
    setCompleted(localStorage.getItem(completedKey) === 'true');
    setReadingProgress(Number(localStorage.getItem(progressKey) || 0));
  }, [notesKey, completedKey, progressKey]);

  function saveNotes() {
    localStorage.setItem(notesKey, notes);
    setNotesSaved(true);

    window.setTimeout(() => {
      setNotesSaved(false);
    }, 1500);
  }

  function markComplete() {
    setCompleted(true);
    setReadingProgress(100);
    localStorage.setItem(completedKey, 'true');
    localStorage.setItem(progressKey, '100');
  }

  function updateReadingProgress(value: number) {
    setReadingProgress(value);
    localStorage.setItem(progressKey, String(value));

    if (value >= 100) {
      setCompleted(true);
      localStorage.setItem(completedKey, 'true');
    }
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

  function openPdfNewTab() {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }

  function downloadPdf() {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${course?.title || 'course-material'}.pdf`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
  }

  function zoomIn() {
    setZoom((value) => Math.min(value + 10, 140));
  }

  function zoomOut() {
    setZoom((value) => Math.max(value - 10, 70));
  }

  function resetZoom() {
    setZoom(100);
  }

  function goToNextLesson() {
    if (!nextLesson) return;

    if (nextLesson.type === 'video') {
      navigate(`/study/${courseId}/video`);
      return;
    }

    if (nextLesson.type === 'voice') {
      navigate(`/study/${courseId}/voice`);
      return;
    }

    navigate(`/study/${courseId}/pdf`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-4 font-semibold text-slate-700">
            Loading PDF lesson…
          </p>
        </div>
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Cannot open PDF lesson
          </h1>

          <p className="mt-3 text-slate-600">
            {loadError || 'Course not found.'}
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
                PDF lesson
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
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            <span className="w-12 text-right text-sm font-black text-slate-700">
              {readingProgress}%
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
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-6">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center">
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

                  <Badge>PDF material</Badge>
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
                  onClick={zoomOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Minus className="h-4 w-4" />
                  Zoom out
                </button>

                <button
                  onClick={resetZoom}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <ZoomIn className="h-4 w-4" />
                  {zoom}%
                </button>

                <button
                  onClick={zoomIn}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Zoom in
                </button>

                <button
                  onClick={openPdfNewTab}
                  disabled={!pdfUrl}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </button>

                <button
                  onClick={downloadPdf}
                  disabled={!pdfUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="relative bg-slate-100 p-4">
              {pdfUrl ? (
                <div className="mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div
                    className="origin-top transition"
                    style={{
                      width: `${zoom}%`,
                      maxWidth: '140%',
                    }}
                  >
                    <iframe
                      ref={pdfFrameRef}
                      src={pdfUrl}
                      title={`${course.title} PDF`}
                      className="h-[760px] w-full border-0 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                    <FileText className="h-8 w-8" />
                  </div>

                  <h2 className="text-2xl font-black text-slate-950">
                    No PDF uploaded
                  </h2>

                  <p className="mt-3 max-w-md text-slate-500">
                    This course does not have a PDF file yet. Upload a PDF from
                    the backend or use the video lesson if available.
                  </p>

                  {course.videoUrl && (
                    <button
                      onClick={() => navigate(`/study/${courseId}/video`)}
                      className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
                    >
                      Open video lesson
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={goToNextLesson}
                disabled={!nextLesson}
                className={`absolute right-8 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl shadow-xl transition ${
                  nextLesson
                    ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700'
                    : 'cursor-not-allowed bg-slate-300 text-slate-500'
                }`}
                aria-label="Next lesson"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Reading progress
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Move the slider as you read. AI tools unlock when completed.
                  </p>
                </div>

                {!completed && (
                  <button
                    onClick={markComplete}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark complete
                  </button>
                )}
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={readingProgress}
                onChange={(event) =>
                  updateReadingProgress(Number(event.target.value))
                }
                className="mt-5 w-full accent-indigo-600"
              />
            </div>
          </div>

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
                      'Read the PDF material, take notes, track your reading progress, then unlock the AI summary and quiz when you complete the lesson.'}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InfoRow
                      icon={<FileText />}
                      title="PDF reader"
                      text="Read the course PDF directly inside the study page."
                    />

                    <InfoRow
                      icon={<Maximize2 />}
                      title="Open full PDF"
                      text="Open the PDF in a new tab if you want a larger reading view."
                    />

                    <InfoRow
                      icon={<Download />}
                      title="Download material"
                      text="Save the PDF file for offline review."
                    />

                    <InfoRow
                      icon={<Keyboard />}
                      title="Reading progress"
                      text="Use the progress slider to track how much you have completed."
                    />

                    <InfoRow
                      icon={<Save />}
                      title="Notes"
                      text="Save your personal study notes locally in your browser."
                    />

                    <InfoRow
                      icon={<Sparkles />}
                      title="AI tools"
                      text="Summary and quiz unlock after you mark the PDF lesson complete."
                    />
                  </div>
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
                    placeholder="Write your PDF notes here..."
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
                        Follow the course structure and continue each lesson.
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
        </section>

        <aside className="grid min-h-0 gap-6 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:grid-rows-2 lg:self-start">
          <TutorPanel
            courseId={course._id}
            courseTitle={course.title}
            extraContext={`PDF lesson. Reading progress: ${readingProgress}%. Completed: ${completed}.`}
          />

          <Panel title="Study status">
            <div className="flex h-full min-h-0 flex-col">
              <div className="rounded-2xl bg-indigo-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                  Reading progress
                </p>

                <p className="mt-2 text-4xl font-black text-slate-950">
                  {readingProgress}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-black text-slate-950">
                  {completed ? 'Lesson completed' : 'Lesson in progress'}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {completed
                    ? 'AI Summary and Quiz are now unlocked from the header.'
                    : 'Finish reading and mark the lesson complete to unlock AI tools.'}
                </p>
              </div>

              {!completed && (
                <button
                  onClick={markComplete}
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark PDF complete
                </button>
              )}
            </div>
          </Panel>
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
      role: 'assistant',
      content: `Hi! I'm your AI tutor for "${courseTitle}". Ask me anything about this PDF lesson.`,
      at: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      at: Date.now(),
    };

    setMessages((current) => [...current, userMsg]);
    setInput('');
    setSending(true);

    try {
      const reply = await aiService.chat(
        courseId,
        [...messages, userMsg],
        text + (extraContext ? `\n[ctx: ${extraContext}]` : '')
      );

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: reply,
          at: Date.now(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble answering that. Try again.',
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
              Ask anything about this PDF
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={`${message.at}-${index}`}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-800'
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
              if (event.key === 'Enter') send();
            }}
            placeholder="Ask about this PDF…"
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
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-700'
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

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
                  key={lesson._id || lesson.id || `${moduleIndex}-${lessonIndex}`}
                  className={`rounded-xl border p-3 ${
                    active
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-bold text-slate-800">
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold capitalize text-slate-500">
                        {lesson.type || 'pdf'}
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