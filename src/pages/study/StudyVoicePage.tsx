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
  FileQuestion,
  FileText,
  Keyboard,
  LayoutList,
  Loader2,
  Mic,
  MicOff,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
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
          type: 'voice',
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

export default function StudyVoicePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const recognitionRef = useRef<any>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [completed, setCompleted] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechError, setSpeechError] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const notesKey = useMemo(
    () => `edunova:study-voice-notes:${courseId || 'unknown'}`,
    [courseId]
  );

  const completedKey = useMemo(
    () => `edunova:study-voice-completed:${courseId || 'unknown'}`,
    [courseId]
  );

  const progressKey = useMemo(
    () => `edunova:study-voice-progress:${courseId || 'unknown'}`,
    [courseId]
  );

  const modules = useMemo(() => (course ? buildModules(course) : []), [course]);
  const flatLessons = useMemo(() => getFlatLessons(modules), [modules]);

  const currentLessonIndex = 0;
  const nextLesson = flatLessons[currentLessonIndex + 1];

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
    setSessionProgress(Number(localStorage.getItem(progressKey) || 0));
  }, [notesKey, completedKey, progressKey]);

  useEffect(() => {
    if (!course) return;

    const greeting = `Hi! I'm your AI voice tutor for "${course.title}". Press the microphone and ask me anything about this course.`;

    setMessages([
      {
        role: 'assistant',
        content: greeting,
        at: Date.now(),
      },
    ]);
  }, [course]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  function speak(text: string) {
    if (muted) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel?.();
    setSpeaking(false);
  }

  function startListening() {
    setSpeechError('');

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Try Google Chrome.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
      setListening(true);
      setLiveTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += text;
        } else {
          interim += text;
        }
      }

      setLiveTranscript(finalTranscript || interim);
    };

    recognition.onerror = () => {
      setListening(false);
      setSpeechError('Could not listen. Check microphone permission and retry.');
    };

    recognition.onend = async () => {
      setListening(false);

      const text = finalTranscript.trim() || liveTranscript.trim();
      if (!text || !course) return;

      await sendVoiceMessage(text);
      setLiveTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop?.();
    setListening(false);
  }

  async function sendVoiceMessage(text: string) {
    if (!course || thinking) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      at: Date.now(),
    };

    setMessages((current) => [...current, userMessage]);
    setThinking(true);

    try {
      const reply = await aiService.chat(course._id, [...messages, userMessage], text);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: reply,
        at: Date.now(),
      };

      setMessages((current) => [...current, assistantMessage]);
      speak(reply);

      const nextProgress = Math.min(95, sessionProgress + 15);
      setSessionProgress(nextProgress);
      localStorage.setItem(progressKey, String(nextProgress));
    } catch {
      const fallback =
        'Sorry, I had trouble answering that. Please try again.';

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: fallback,
          at: Date.now(),
        },
      ]);

      speak(fallback);
    } finally {
      setThinking(false);
    }
  }

  function resetConversation() {
    if (!course) return;

    stopSpeaking();
    stopListening();

    const greeting = `Hi! I'm your AI voice tutor for "${course.title}". Press the microphone and ask me anything about this course.`;

    setMessages([
      {
        role: 'assistant',
        content: greeting,
        at: Date.now(),
      },
    ]);

    setLiveTranscript('');
    setSpeechError('');
  }

  function saveNotes() {
    localStorage.setItem(notesKey, notes);
    setNotesSaved(true);

    window.setTimeout(() => {
      setNotesSaved(false);
    }, 1500);
  }

  function addTranscriptToNotes() {
    if (!liveTranscript.trim()) return;

    setNotes((value) => `${value}${value ? '\n' : ''}${liveTranscript.trim()}`);
    setActiveTab('notes');
  }

  function markComplete() {
    setCompleted(true);
    setSessionProgress(100);
    localStorage.setItem(completedKey, 'true');
    localStorage.setItem(progressKey, '100');
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

    if (nextLesson.type === 'video') {
      navigate(`/study/${courseId}/video`);
      return;
    }

    if (nextLesson.type === 'pdf') {
      navigate(`/study/${courseId}/pdf`);
      return;
    }

    navigate(`/study/${courseId}/voice`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-4 font-semibold text-slate-700">
            Loading voice lesson…
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
            Cannot open voice lesson
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
                Voice lesson
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
                style={{ width: `${sessionProgress}%` }}
              />
            </div>

            <span className="w-12 text-right text-sm font-black text-slate-700">
              {sessionProgress}%
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
            style={{ width: `${sessionProgress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-6">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-950 px-6 py-12 text-white">
              <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />

              <button
                onClick={goToNextLesson}
                disabled={!nextLesson}
                className={`absolute right-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl shadow-xl transition ${
                  nextLesson
                    ? 'bg-white text-indigo-700 shadow-black/20 hover:bg-indigo-50'
                    : 'cursor-not-allowed bg-white/20 text-white/50'
                }`}
                aria-label="Next lesson"
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/15 backdrop-blur">
                  {listening ? (
                    <Waves className="h-10 w-10 animate-pulse" />
                  ) : (
                    <Mic className="h-10 w-10" />
                  )}
                </div>

                <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                  AI voice tutor
                </p>

                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Talk through the lesson
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-8 text-indigo-50">
                  Ask questions with your voice, listen to explanations, take
                  notes, and complete the session to unlock AI summary and quiz.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={listening ? stopListening : startListening}
                    disabled={thinking}
                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-black shadow-lg transition ${
                      listening
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-white text-indigo-700 hover:bg-indigo-50'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {listening ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        Stop listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Start speaking
                      </>
                    )}
                  </button>

                  <button
                    onClick={speaking ? stopSpeaking : () => speak(messages.at(-1)?.content || '')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                  >
                    {speaking ? (
                      <>
                        <PauseCircle className="h-5 w-5" />
                        Stop audio
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-5 w-5" />
                        Replay answer
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setMuted((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                  >
                    {muted ? (
                      <>
                        <VolumeX className="h-5 w-5" />
                        Muted
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-5 w-5" />
                        Voice on
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetConversation}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Reset
                  </button>
                </div>
              </div>
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

                    <Badge>Voice mode</Badge>
                  </div>

                  <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
                    {course.title}
                  </h2>

                  {course.instructor?.name && (
                    <p className="mt-2 text-sm text-slate-500">
                      Instructor: {course.instructor.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={addTranscriptToNotes}
                    disabled={!liveTranscript.trim()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    <FileText className="h-4 w-4" />
                    Add transcript to notes
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

              {(listening || thinking || speaking || liveTranscript || speechError) && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Session status
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
                    {speechError ||
                      liveTranscript ||
                      (listening
                        ? 'Listening…'
                        : thinking
                          ? 'Thinking…'
                          : speaking
                            ? 'Speaking…'
                            : '')}
                  </p>
                </div>
              )}
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
                      'Use voice mode to ask questions, listen to explanations, and practice the lesson through conversation.'}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InfoRow
                      icon={<Mic />}
                      title="Voice interaction"
                      text="Click Start speaking, ask your question, then listen to the AI answer."
                    />

                    <InfoRow
                      icon={<Volume2 />}
                      title="Audio response"
                      text="The tutor can speak answers aloud. You can replay or mute responses."
                    />

                    <InfoRow
                      icon={<FileText />}
                      title="Notes"
                      text="Save personal notes and add voice transcript snippets."
                    />

                    <InfoRow
                      icon={<Keyboard />}
                      title="Browser support"
                      text="Speech recognition works best in Google Chrome."
                    />

                    <InfoRow
                      icon={<CheckCircle2 />}
                      title="Completion"
                      text="Mark the voice lesson complete to unlock AI summary and quiz."
                    />

                    <InfoRow
                      icon={<Sparkles />}
                      title="AI tools"
                      text="Summary and quiz unlock after completion from the header."
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
                    placeholder="Write your voice lesson notes here..."
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
          <ConversationPanel
            messages={messages}
            thinking={thinking}
          />

          <Panel title="Study status">
            <div className="flex h-full min-h-0 flex-col">
              <div className="rounded-2xl bg-indigo-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                  Voice session progress
                </p>

                <p className="mt-2 text-4xl font-black text-slate-950">
                  {sessionProgress}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${sessionProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-black text-slate-950">
                  {completed ? 'Lesson completed' : 'Voice lesson in progress'}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {completed
                    ? 'AI Summary and Quiz are now unlocked from the header.'
                    : 'Ask questions or mark the voice lesson complete to unlock AI tools.'}
                </p>
              </div>

              {!completed && (
                <button
                  onClick={markComplete}
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark voice complete
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

function ConversationPanel({
  messages,
  thinking,
}: {
  messages: ChatMessage[];
  thinking: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, thinking]);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 bg-indigo-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black text-slate-950">Voice conversation</h2>
            <p className="text-sm text-slate-500">
              Your tutor session history
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

        {thinking && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
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
                        {lesson.type || 'voice'}
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