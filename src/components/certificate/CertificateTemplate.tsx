import { GraduationCap } from "lucide-react"
import logoImage from "../../assets/images/Logo.png"

interface CertificateTemplateProps {
  studentName: string
  courseTitle: string
  instructorName?: string
  durationHours?: number
  category?: string
  issuedAt: string | Date
  code: string
}

export default function CertificateTemplate({
  studentName,
  courseTitle,
  durationHours,
  category,
  issuedAt,
  code,
}: CertificateTemplateProps) {
  const dateStr = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      id="certificate"
      className="relative w-full aspect-[1.414/1] max-w-5xl mx-auto bg-gradient-to-br from-[#fdfaff] via-white to-[#f5f0ff] overflow-hidden shadow-2xl print:shadow-none print:max-w-none"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Decorative outer borders */}
      <div className="absolute inset-3 sm:inset-5 border-4 border-[#6C3EF4]/30 rounded-sm pointer-events-none" />
      <div className="absolute inset-5 sm:inset-8 border border-[#6C3EF4]/40 rounded-sm pointer-events-none" />

      {/* Corner ornaments */}
      {[
        "top-2 left-2 sm:top-4 sm:left-4",
        "top-2 right-2 sm:top-4 sm:right-4 rotate-90",
        "bottom-2 left-2 sm:bottom-4 sm:left-4 -rotate-90",
        "bottom-2 right-2 sm:bottom-4 sm:right-4 rotate-180",
      ].map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} w-12 h-12 sm:w-20 sm:h-20 text-[#6C3EF4]/40`}
          viewBox="0 0 80 80"
          fill="none"
        >
          <path
            d="M5 5 L40 5 M5 5 L5 40 M5 5 Q22 22 35 5 M5 5 Q22 22 5 35"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="5" cy="5" r="2.5" fill="currentColor" />
          <circle cx="40" cy="5" r="1.5" fill="currentColor" />
          <circle cx="5" cy="40" r="1.5" fill="currentColor" />
        </svg>
      ))}

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <GraduationCap className="w-[55%] h-[55%]" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between px-8 sm:px-16 py-8 sm:py-12 text-center">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="EduNova" className="h-9 sm:h-12 w-auto" />
          <span className="text-xl sm:text-2xl font-bold text-[#6C3EF4] tracking-tight">
            EduNova AI
          </span>
        </div>

        {/* Middle */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-slate-500">
            Certificate of Completion
          </p>
          <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#6C3EF4] to-transparent" />

          <p className="text-sm sm:text-base text-slate-600 italic">
            This is to certify that
          </p>

          <h1
            className="text-3xl sm:text-5xl font-bold text-slate-900 mt-1 sm:mt-2 px-6 pb-1 border-b-2 border-[#6C3EF4]/40"
            style={{
              fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
              fontWeight: 400,
            }}
          >
            {studentName}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-2 sm:mt-3">
            has successfully completed the course
          </p>

          <h2 className="text-xl sm:text-3xl font-semibold text-[#6C3EF4] max-w-3xl leading-snug px-4">
            “{courseTitle}”
          </h2>

          {(durationHours || category) && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {category && <span>{category}</span>}
              {category && durationHours ? " · " : ""}
              {durationHours && <span>{durationHours} hours of learning</span>}
            </p>
          )}
        </div>

        {/* Bottom row */}
        <div className="w-full grid grid-cols-3 items-end gap-4 sm:gap-8">
          {/* Date */}
          <div className="flex flex-col items-center">
            <div className="w-full border-t border-slate-400 pt-1" />
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500">
              Issued on
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-800 mt-0.5">
              {dateStr}
            </p>
          </div>

          {/* Seal */}
          <div className="flex flex-col items-center -mt-4">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#4d2bb5] flex items-center justify-center shadow-lg ring-4 ring-white">
              <GraduationCap className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              {/* Tiny ribbon underneath */}
              <div className="absolute -bottom-2 w-10 sm:w-14 h-3 sm:h-4 bg-gradient-to-r from-[#6C3EF4] to-[#4d2bb5] clip-ribbon" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mt-3">
              Official seal
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              EduNova AI
            </p>
          </div>

          {/* Verification code */}
          <div className="flex flex-col items-center">
            <div className="w-full border-t border-slate-400 pt-1" />
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500">
              Verification code
            </p>
            <p className="text-xs sm:text-sm font-mono font-semibold text-slate-800 mt-0.5 tracking-wider">
              {code}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}