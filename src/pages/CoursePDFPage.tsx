import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { enrollmentService } from "../services/enrollment.service";
import CourseAssistantPanel from "../components/ai/CourseAssistantPanel";

type Course = {
  _id: string;
  title: string;
  description?: string;
  pdfUrl?: string;
};

function normalizeUrl(raw?: string) {
  if (!raw) return "";

  // If backend accidentally returns markdown link: [text](http://url)
  const md = raw.match(/\((https?:\/\/[^)]+)\)/);
  if (md?.[1]) return md[1];

  // If backend returns <http://url>
  const angle = raw.match(/^<\s*(https?:\/\/[^>]+)\s*>$/);
  if (angle?.[1]) return angle[1];

  return raw.trim();
}

export default function CoursePDFPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: token key matches your api.ts
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  useEffect(() => {
    if (!id) {
      setError("Missing course id.");
      setLoading(false);
      setCheckingAccess(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch course details
        const res = await fetch(`/api/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const text = await res.text();
        let json: any;

        try {
          json = JSON.parse(text);
        } catch {
          console.log("NON-JSON RESPONSE (first 200 chars):", text.slice(0, 200));
          throw new Error(
            "API did not return JSON. Check Vite proxy or API base URL."
          );
        }

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load course.");
        }

        // backend shape: { success: true, data: {...} }
        const c: Course = json?.data ?? json;
        setCourse(c);

        // 2) Check enrollment (uses your /my-learning data)
        setCheckingAccess(true);
        const mine = await enrollmentService.mine();
        const enrollments = mine?.data?.data ?? [];

        const enrolled = enrollments.some((e: any) => e?.course?._id === id);
        setHasAccess(enrolled);

        if (!enrolled) setError("You are not enrolled in this course.");
      } catch (err: any) {
        setError(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
        setCheckingAccess(false);
      }
    };

    run();
  }, [id, token]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading…</div>;
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h1 className="text-xl font-extrabold text-slate-800 mb-2">
            Cannot open course
          </h1>
          <p className="text-gray-500">{error || "Course not found."}</p>

          <button
            onClick={() => navigate("/my-learning")}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold"
          >
            Go to My Learning
          </button>
        </div>
      </div>
    );
  }

  if (checkingAccess) {
    return <div className="p-8 text-center text-gray-400">Checking access…</div>;
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h1 className="text-xl font-extrabold text-slate-800 mb-2">
            Access denied
          </h1>
          <p className="text-gray-500">
            You must be enrolled in this course to view the PDF.
          </p>
        </div>
      </div>
    );
  }

  const pdfSrc = normalizeUrl(course.pdfUrl);

  if (!pdfSrc) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h1 className="text-xl font-extrabold text-slate-800 mb-2">
            PDF not available
          </h1>
          <p className="text-gray-500">
            This course does not have a PDF yet (missing <code>pdfUrl</code>).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-extrabold text-slate-800 line-clamp-1">
          {course.title}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <iframe src={pdfSrc} title={course.title} className="w-full h-[80vh]" />
      </div>

      <CourseAssistantPanel courseId={course._id} />
    </div>
  );
}
