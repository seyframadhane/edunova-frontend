import { useEffect, useRef, useState } from "react"
import { Camera, CameraOff } from "lucide-react"

type Emotion = "engaged" | "confused" | "frustrated" | "confident" | "neutral"

const styleFor: Record<Emotion, string> = {
  engaged: "bg-emerald-100 text-emerald-700 border-emerald-200",
  confused: "bg-amber-100 text-amber-700 border-amber-200",
  frustrated: "bg-rose-100 text-rose-700 border-rose-200",
  confident: "bg-indigo-100 text-indigo-700 border-indigo-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
}

function mapExpression(exprs: Record<string, number>): Emotion {
  const best = Object.entries(exprs).sort((a, b) => b[1] - a[1])[0]?.[0]
  switch (best) {
    case "happy": return "engaged"
    case "surprised": return "engaged"
    case "sad": return "frustrated"
    case "angry": return "frustrated"
    case "disgusted": return "frustrated"
    case "fearful": return "confused"
    default: return "neutral"
  }
}

let initPromise: Promise<any> | null = null
async function initFaceApi() {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const faceapi = await import("@vladmandic/face-api")
    const tf = faceapi.tf as any

    // Try WebGL first (fastest), then CPU fallback.
    // Skip WASM entirely — it requires serving a .wasm file which Vite
    // doesn't proxy correctly without extra config.
    let backendOk = false
    try {
      await tf.setBackend("webgl")
      await tf.ready()
      backendOk = tf.getBackend() === "webgl"
    } catch {
      /* will try CPU below */
    }

    if (!backendOk) {
      console.warn("[face-api] WebGL unavailable — falling back to CPU backend. Detection will be slower.")
      await tf.setBackend("cpu")
      await tf.ready()
    }

    const MODEL_URL = "/face-api-models"
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
    return faceapi
  })()
  return initPromise
}

export function useEmotion(active: boolean) {
  const [emotion, setEmotion] = useState<Emotion>("neutral")
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    let stream: MediaStream | null = null
    let cancelled = false

      ; (async () => {
        try {
          const faceapi = await initFaceApi()
          if (cancelled) return

          stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
          if (!videoRef.current) return
          videoRef.current.srcObject = stream
          await videoRef.current.play()

          intervalRef.current = window.setInterval(async () => {
            if (!videoRef.current) return
            try {
              const result = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()
              if (result?.expressions) {
                setEmotion(mapExpression(result.expressions as any))
              }
            } catch {
              /* transient detection error — ignore this frame */
            }
          }, 3500)
        } catch (e: any) {
          setError(e?.message || "Couldn't access camera or load models")
        }
      })()

    return () => {
      cancelled = true
      if (intervalRef.current) clearInterval(intervalRef.current)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [active])

  return { videoRef, emotion, error }
}

export default function EmotionMonitor({ active }: { active: boolean }) {
  const { videoRef, emotion, error } = useEmotion(active)

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
      <video ref={videoRef} muted playsInline className="w-full aspect-[4/3] object-cover" />
      <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] text-white/90 bg-black/40 backdrop-blur rounded-full px-2 py-1">
        {active ? <Camera size={10} /> : <CameraOff size={10} />} {active ? "Live" : "Paused"}
      </div>
      <div className="absolute bottom-2 right-2">
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${styleFor[emotion]}`}>
          {emotion}
        </span>
      </div>
      {error && (
        <div className="absolute inset-0 bg-black/70 text-white text-xs p-3 flex items-center justify-center text-center">
          {error}
        </div>
      )}
    </div>
  )
}