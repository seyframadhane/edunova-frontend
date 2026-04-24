import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX,
  Maximize, Rewind, FastForward, CheckCircle2, Circle,
  ArrowLeft, FileText, BookOpen, Award
} from 'lucide-react';
import { enrollmentService } from '../services/enrollment.service';
import CourseAssistantPanel from '../components/ai/CourseAssistantPanel';

type Course = {
  _id: string;
  title: string;
  description?: string;
  contentType?: 'pdf' | 'video' | 'mixed';
  videoUrl?: string;
  videoPoster?: string;
  videoDurationSec?: number;
  pdfUrl?: string;
};

/** Handles accidental markdown / angle-bracket wrapping from the DB */
function normalizeUrl(raw?: string) {
  if (!raw) return '';
  const md = raw.match(/\((https?:\/\/[^)]+)\)/);
  if (md?.[1]) return md[1];
  const angle = raw.match(/^<\s*(https?:\/\/[^>]+)\s*>$/);
  if (angle?.[1]) return angle[1];
  return raw.trim();
}

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CourseLearningPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('accessToken'), []);

  // Data / access state
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'downloads'>('overview');
  const [weekOpen, setWeekOpen] = useState(true);

  /* ---------------- fetch course + check enrollment ---------------- */
  useEffect(() => {
    if (!id) {
      setError('Missing course id.');
      setLoading(false);
      setCheckingAccess(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/courses/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const text = await res.text();
        let json: any;
        try { json = JSON.parse(text); }
        catch { throw new Error('API did not return JSON. Check proxy/base URL.'); }
        if (!res.ok) throw new Error(json?.message || 'Failed to load course.');

        const c: Course = json?.data ?? json;
        setCourse(c);

        // Enrollment check
        setCheckingAccess(true);
        const mine = await enrollmentService.mine();
        const enrollments = mine?.data?.data ?? [];
        const enrolled = enrollments.some((e: any) => e?.course?._id === id);
        setHasAccess(enrolled);
        if (!enrolled) setError('You are not enrolled in this course.');
      } catch (err: any) {
        setError(err?.message || 'Something went wrong.');
      } finally {
        setLoading(false);
        setCheckingAccess(false);
      }
    })();
  }, [id, token]);

  /* ---------------- video <-> state sync ---------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime  = () => setCurrentTime(v.currentTime);
    const onMeta  = () => setDuration(v.duration || 0);
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd   = () => setIsPlaying(false);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnd);
    };
  }, [course?.videoUrl]);

  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (videoRef.current) videoRef.current.muted  = muted; },  [muted]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);

  /* ---------------- player actions ---------------- */
  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    v.paused ? v.play() : v.pause();
  };
  const seekBy = (delta: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = Math.max(0, Math.min((v.duration || 0), v.currentTime + delta));
  };
  const seekTo = (sec: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = sec;
  };
  const goFullscreen = () => {
    const v = videoRef.current; if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  };

  /* ---------------- render early states ---------------- */
  if (loading)        return <div className="p-10 text-gray-700">Loading…</div>;
  if (checkingAccess) return <div className="p-10 text-gray-700">Checking access…</div>;

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-6">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Cannot open course</h1>
          <p className="text-gray-600 mt-2">{error || 'Course not found.'}</p>
          <button onClick={() => navigate('/my-learning')} className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">
            Go to My Learning
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
          <p className="text-gray-600 mt-2">You must be enrolled in this course to watch it.</p>
        </div>
      </div>
    );
  }

  const videoSrc = normalizeUrl(course.videoUrl);

  if (!videoSrc) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-6">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-900">No video yet</h1>
          <p className="text-gray-600 mt-2">This course does not have a video uploaded.</p>
          {course.pdfUrl && (
            <button onClick={() => navigate(`/learn/courses/${course._id}/pdf`)} className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">
              Open PDF instead
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- main UI ---------------- */
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Placeholder syllabus — replace with real Module/Lesson data when you wire those APIs.
  const lessons = [
    { id: 1, title: course.title, type: 'Video', duration: fmt(duration), status: 'active', section: 'Main lesson' },
  ];
  const grouped = lessons.reduce((acc, l) => {
    (acc[l.section] = acc[l.section] || []).push(l);
    return acc;
  }, {} as Record<string, typeof lessons>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#6C3EF4] to-[#9A6BFF] text-white px-8 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs uppercase tracking-widest text-white/80">Now playing</div>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1">{course.title}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* MAIN */}
        <section className="space-y-4">
          {/* Video card */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative group">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={normalizeUrl(course.videoPoster) || undefined}
              className="w-full aspect-video bg-black"
              onClick={togglePlay}
              preload="metadata"
              playsInline
            />

            {/* Play overlay */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-100 transition"
              >
                <span className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                  <Play className="w-10 h-10 text-[#6C3EF4]" />
                </span>
              </button>
            )}

            {/* Controls */}
            <div className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent text-white">
              {/* Progress bar */}
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="w-full accent-[#9A6BFF] cursor-pointer"
              />

              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => seekBy(-10)} title="Rewind 10s"><Rewind className="w-5 h-5" /></button>
                  <button onClick={togglePlay} title="Play/Pause">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button onClick={() => seekBy(10)} title="Forward 10s"><FastForward className="w-5 h-5" /></button>

                  <button onClick={() => setMuted((m) => !m)} title="Mute">
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range" min={0} max={1} step={0.05}
                    value={volume}
                    onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                    className="w-24 accent-white"
                  />

                  <span className="tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="bg-black/40 border border-white/30 rounded px-2 py-0.5 text-xs"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <option key={s} value={s}>{s}x</option>
                    ))}
                  </select>
                  <button onClick={goFullscreen} title="Fullscreen"><Maximize className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Progress hairline */}
              <div className="h-0.5 bg-white/20 rounded mt-2">
                <div className="h-0.5 bg-[#9A6BFF] rounded" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex gap-6 border-b border-gray-200">
              {(['overview', 'notes', 'downloads'] as const).map((tab) => (
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

            {activeTab === 'overview' && (
              <div className="pt-4 text-gray-700 text-sm leading-6">
                {course.description || 'No description provided for this course.'}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="pt-4 text-sm text-gray-500">
                You haven't taken any notes yet.
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="pt-4 text-sm text-gray-600 space-y-2">
                {course.pdfUrl ? (
                  <a
                    href={normalizeUrl(course.pdfUrl)}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#6C3EF4] hover:underline"
                  >
                    <FileText className="w-4 h-4" /> Course PDF
                  </a>
                ) : (
                  <div className="text-gray-500">No downloads available for this course.</div>
                )}
              </div>
            )}
          </div>

          {/* AI Assistant (already in your repo) */}
          <CourseAssistantPanel courseId={course._id} />
        </section>

        {/* SIDEBAR */}
        <aside className="bg-white rounded-2xl shadow p-5 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-[#6C3EF4]" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Course progress</div>
              <div className="text-xs text-gray-500">{fmt(currentTime)} watched</div>
            </div>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-[#6C3EF4]" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-6">
            <button onClick={() => setWeekOpen((o) => !o)} className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-900">Syllabus</span>
              </div>
              {weekOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {weekOpen && (
              <div className="space-y-4">
                {Object.entries(grouped).map(([section, items]) => (
                  <div key={section}>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">{section}</div>
                    <ul className="space-y-2">
                      {items.map((l) => (
                        <li key={l.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                          {l.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                          ) : l.status === 'active' ? (
                            <Play className="w-4 h-4 text-[#6C3EF4] mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{l.title}</div>
                            <div className="text-xs text-gray-500">{l.type} · {l.duration}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/quiz')}
            className="mt-6 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
          >
            Take quiz
          </button>
        </aside>
      </div>
    </div>
  );
}