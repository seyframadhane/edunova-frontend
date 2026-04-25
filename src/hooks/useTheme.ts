import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "edunova:theme"

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  root.classList.toggle("dark", isDark)
  root.dataset.theme = theme
}

export function useTheme(theme: Theme | undefined) {
  useEffect(() => {
    if (!theme) return
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)

    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])
}

/** Call this once during app bootstrap (before React renders) to avoid a flash. */
export function bootstrapTheme() {
  const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) || "light"
  applyTheme(stored)
}