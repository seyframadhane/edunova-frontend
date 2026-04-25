import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  User, Lock, Bell, Palette, Shield, Camera, Eye, EyeOff,
  Check, Mail, Globe, Sun, Moon, Monitor, AlertTriangle,
  Download, LogOut, Trash2, Key, Smartphone, ChevronRight,
} from "lucide-react"
import { api } from "../services/api"
import { authService } from "../services/auth.service"
import { useAuth } from "../context/AuthContext"
import { settingsService, type UserSettings, type PartialSettings } from "../services/settings.service"
import { useTheme } from "../hooks/useTheme"

type Tab = "profile" | "account" | "notifications" | "preferences" | "privacy"

const TABS: Array<{ key: Tab; label: string; icon: any; desc: string }> = [
  { key: "profile",       label: "Profile",       icon: User,    desc: "Personal information" },
  { key: "account",       label: "Account",       icon: Lock,    desc: "Password & security" },
  { key: "notifications", label: "Notifications", icon: Bell,    desc: "Email & in-app alerts" },
  { key: "preferences",   label: "Preferences",   icon: Palette, desc: "Language & appearance" },
  { key: "privacy",       label: "Privacy",       icon: Shield,  desc: "Data & account control" },
]

const defaultSettings: UserSettings = {
  notifications: {
    emailCourse: true, emailNewsletter: true, emailMarketing: false,
    pushCourse: true, pushReminders: true, pushMarketing: false,
  },
  preferences: { theme: "light", language: "en" },
  privacy: { showOnLeaderboard: true, showCertificatesPublicly: true },
}

export default function SettingsPage() {
  const { user, logout, setUser } = useAuth() as any
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("profile")
  const [settings, setSettings] = useState<UserSettings>(
    user?.settings ? { ...defaultSettings, ...user.settings } : defaultSettings
  )

  // Apply theme live
  useTheme(settings.preferences.theme)

  // Refresh from backend on mount (in case AuthContext is stale)
  useEffect(() => {
    authService.me()
      .then(({ data }: any) => {
        const u = data.data
        setUser?.(u)
        if (u?.settings) setSettings({ ...defaultSettings, ...u.settings })
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist a partial settings change (optimistic)
  const persist = async (patch: PartialSettings, message = "Settings updated") => {
    const next: UserSettings = {
      notifications: { ...settings.notifications, ...(patch.notifications || {}) },
      preferences:   { ...settings.preferences,   ...(patch.preferences   || {}) },
      privacy:       { ...settings.privacy,       ...(patch.privacy       || {}) },
    }
    setSettings(next) // optimistic
    try {
      const saved = await settingsService.update(patch)
      setSettings({ ...defaultSettings, ...saved })
      toast.success(message)
    } catch (e: any) {
      setSettings(settings) // rollback
      toast.error(e?.response?.data?.message || "Save failed")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
            Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Manage your profile, security, and preferences.
          </p>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside>
            <div className="lg:hidden mb-4">
              <select value={tab} onChange={(e) => setTab(e.target.value as Tab)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15">
                {TABS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>

            <nav className="hidden lg:block sticky top-6 space-y-1">
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.key
                return (
                  <button key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left transition group ${
                      active
                        ? "bg-[#6C3EF4]/8 text-[#6C3EF4]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#6C3EF4]" : "text-slate-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${active ? "text-[#6C3EF4]" : ""}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{t.desc}</p>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-[#6C3EF4]" />}
                  </button>
                )
              })}

              <button onClick={() => { logout?.(); navigate("/login") }}
                className="w-full mt-4 pt-4 border-t border-slate-200 flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </nav>
          </aside>

          <main>
            {tab === "profile" && (
              <ProfileSection user={user} setUser={setUser} />
            )}
            {tab === "account" && <AccountSection />}
            {tab === "notifications" && (
              <NotificationsSection settings={settings} onChange={persist} />
            )}
            {tab === "preferences" && (
              <PreferencesSection settings={settings} onChange={persist} />
            )}
            {tab === "privacy" && (
              <PrivacySection settings={settings} onChange={persist}
                onLogout={() => { logout?.(); navigate("/login") }} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

/* ───────────────── PROFILE ───────────────── */
function ProfileSection({ user, setUser }: { user: any; setUser?: (u: any) => void }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    bio:       user?.bio       || "",
    city:      user?.city      || "",
    country:   user?.country   || "",
  })
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName:  user.lastName  || "",
        bio:       user.bio       || "",
        city:      user.city      || "",
        country:   user.country   || "",
      })
      setAvatar(user.avatar || null)
    }
  }, [user])

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)"); return
    }
    setUploading(true)
    try {
      const updated = await authService.uploadAvatar(file)
      setAvatar(updated.avatar || null)
      setUser?.({ ...user, ...updated })
      toast.success("Avatar updated")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploading(true)
    try {
      const { data }: any = await api.patch("/users/me", { avatar: "" })
      setAvatar(null)
      setUser?.(data.data)
      toast.success("Avatar removed")
    } catch {
      toast.error("Failed to remove")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data }: any = await api.patch("/users/me", form)
      setUser?.(data.data)
      toast.success("Profile updated")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title="Profile" desc="This information will be displayed on your public profile.">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 mb-6 border-b border-slate-200">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C3EF4] to-pink-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 overflow-hidden ring-4 ring-white shadow-md">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() || "U"
            )}
          </div>
          <button onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center shadow-md transition disabled:opacity-60">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">Profile picture</p>
          <p className="text-xs text-slate-500 mt-0.5">JPG, PNG or GIF. Max 5MB.</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-400 transition disabled:opacity-60">
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            {avatar && (
              <button onClick={handleRemoveAvatar} disabled={uploading}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })} required />
          <Field label="Last name" value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })} required />
        </div>

        <Field label="Email address" value={user?.email || ""} onChange={() => {}}
          disabled hint="Contact support to change your email"
          icon={<Mail className="w-4 h-4 text-slate-400" />} />

        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Bio</label>
          <textarea value={form.bio} maxLength={200}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us a bit about yourself…" rows={3}
            className="mt-1.5 w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 transition resize-none" />
          <p className="text-xs text-slate-400 mt-1">{form.bio.length}/200</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" value={form.city}
            onChange={(v) => setForm({ ...form, city: v })} placeholder="Lagos" />
          <Field label="Country" value={form.country}
            onChange={(v) => setForm({ ...form, country: v })} placeholder="Nigeria" />
        </div>

        <FormFooter>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </FormFooter>
      </form>
    </Card>
  )
}

/* ───────────────── ACCOUNT ───────────────── */
function AccountSection() {
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const strength = pw.newPassword.length === 0 ? 0
    : pw.newPassword.length < 6 ? 1
    : pw.newPassword.length < 10 ? 2
    : /[A-Z]/.test(pw.newPassword) && /\d/.test(pw.newPassword) ? 4 : 3
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength]
  const strengthColor = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][strength]

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.newPassword !== pw.confirmPassword) return toast.error("Passwords do not match")
    if (pw.newPassword.length < 6) return toast.error("Password must be 6+ characters")
    setSaving(true)
    try {
      await authService.changePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      })
      toast.success("Password changed")
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password change failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Change password" desc="Use a strong password unique to this account.">
        <form onSubmit={handleChange} className="space-y-4">
          <PasswordField label="Current password" value={pw.currentPassword}
            show={showPw.current} onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
            onChange={(v) => setPw({ ...pw, currentPassword: v })} />
          <PasswordField label="New password" value={pw.newPassword}
            show={showPw.new} onToggle={() => setShowPw({ ...showPw, new: !showPw.new })}
            onChange={(v) => setPw({ ...pw, newPassword: v })} />

          {pw.newPassword.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition ${
                    i <= strength ? strengthColor : "bg-slate-200"
                  }`} />
                ))}
              </div>
              <span className={`text-xs font-semibold ${
                strength <= 1 ? "text-rose-600"
                  : strength === 2 ? "text-amber-600"
                  : strength === 3 ? "text-blue-600"
                  : "text-emerald-600"
              }`}>{strengthLabel}</span>
            </div>
          )}

          <PasswordField label="Confirm new password" value={pw.confirmPassword}
            show={showPw.confirm} onToggle={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
            onChange={(v) => setPw({ ...pw, confirmPassword: v })} />

          <FormFooter>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition">
              {saving ? "Updating…" : "Update password"}
            </button>
          </FormFooter>
        </form>
      </Card>

      <Card title="Two-factor authentication" desc="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Authenticator app</p>
              <p className="text-xs text-slate-500">Use Google Authenticator, Authy, or similar</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
            Not enabled
          </span>
        </div>
        <FormFooter>
          <button disabled
            className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-sm text-slate-500 cursor-not-allowed">
            Enable 2FA — coming soon
          </button>
        </FormFooter>
      </Card>

      <Card title="Active sessions" desc="Devices currently signed in to your account.">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                This device
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  Current
                </span>
              </p>
              <p className="text-xs text-slate-500">Active now</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ───────────────── NOTIFICATIONS ───────────────── */
function NotificationsSection({
  settings, onChange,
}: {
  settings: UserSettings
  onChange: (patch: PartialSettings, message?: string) => void
}) {
  const n = settings.notifications
  const set = (k: keyof typeof n, v: boolean) =>
    onChange({ notifications: { [k]: v } as any }, "Notifications updated")

  return (
    <div className="space-y-6">
      <Card title="Email notifications" desc="Choose what we email you about.">
        <div className="divide-y divide-slate-100">
          <Toggle label="Course updates"
            desc="New lessons, instructor announcements, completion certificates"
            checked={n.emailCourse} onChange={(v) => set("emailCourse", v)} />
          <Toggle label="Weekly newsletter"
            desc="Curated picks and learning tips every Monday"
            checked={n.emailNewsletter} onChange={(v) => set("emailNewsletter", v)} />
          <Toggle label="Promotions & offers"
            desc="Exclusive discounts and seasonal deals"
            checked={n.emailMarketing} onChange={(v) => set("emailMarketing", v)} />
        </div>
      </Card>

      <Card title="In-app notifications" desc="Real-time alerts inside EduNova.">
        <div className="divide-y divide-slate-100">
          <Toggle label="Course progress"
            desc="Reminders to continue where you left off"
            checked={n.pushCourse} onChange={(v) => set("pushCourse", v)} />
          <Toggle label="Daily learning reminders"
            desc="Gentle nudges to keep your streak going"
            checked={n.pushReminders} onChange={(v) => set("pushReminders", v)} />
          <Toggle label="Promotions & announcements"
            desc="Platform news, events, and special offers"
            checked={n.pushMarketing} onChange={(v) => set("pushMarketing", v)} />
        </div>
      </Card>
    </div>
  )
}

/* ───────────────── PREFERENCES ───────────────── */
function PreferencesSection({
  settings, onChange,
}: {
  settings: UserSettings
  onChange: (patch: PartialSettings, message?: string) => void
}) {
  const p = settings.preferences

  return (
    <div className="space-y-6">
      <Card title="Appearance" desc="Choose how EduNova looks on this device.">
        <div className="grid grid-cols-3 gap-3">
          {([
            { key: "light",  label: "Light",  icon: Sun },
            { key: "dark",   label: "Dark",   icon: Moon },
            { key: "system", label: "System", icon: Monitor },
          ] as const).map(({ key, label, icon: Icon }) => {
            const active = p.theme === key
            return (
              <button key={key}
                onClick={() => onChange({ preferences: { theme: key } }, "Theme updated")}
                className={`relative flex flex-col items-center gap-2 py-5 rounded-lg border-2 transition ${
                  active
                    ? "border-[#6C3EF4] bg-[#6C3EF4]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}>
                <Icon className={`w-5 h-5 ${active ? "text-[#6C3EF4]" : "text-slate-500"}`} />
                <span className={`text-sm font-semibold ${active ? "text-[#6C3EF4]" : "text-slate-700"}`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#6C3EF4] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Language & region" desc="Set your preferred language.">
        <label className="block">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Display language
          </span>
          <div className="relative mt-1.5">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={p.language}
              onChange={(e) => onChange({ preferences: { language: e.target.value } }, "Language updated")}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 transition">
              <option value="en">English (US)</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </label>
      </Card>
    </div>
  )
}

/* ───────────────── PRIVACY ───────────────── */
function PrivacySection({
  settings, onChange, onLogout,
}: {
  settings: UserSettings
  onChange: (patch: PartialSettings, message?: string) => void
  onLogout: () => void
}) {
  const v = settings.privacy
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleExport = async () => {
    setExporting(true)
    try {
      const snapshot = await settingsService.exportData()
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `edunova-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Data export downloaded")
    } catch {
      toast.error("Export failed")
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await settingsService.deleteAccount()
      toast.success("Account deactivated")
      onLogout()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed")
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Data export" desc="Download a copy of your account data.">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6C3EF4]/10 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[#6C3EF4]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Download my data</p>
              <p className="text-xs text-slate-500">Get a JSON file with your profile, settings, and learning history.</p>
            </div>
          </div>
          <button onClick={handleExport} disabled={exporting}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-400 transition shrink-0 disabled:opacity-60">
            {exporting ? "Preparing…" : "Download"}
          </button>
        </div>
      </Card>

      <Card title="Profile visibility" desc="Control who can see your activity.">
        <div className="divide-y divide-slate-100">
          <Toggle label="Show on leaderboard"
            desc="Appear in public learning rankings"
            checked={v.showOnLeaderboard}
            onChange={(val) => onChange({ privacy: { showOnLeaderboard: val } }, "Privacy updated")} />
          <Toggle label="Show certificates publicly"
            desc="Allow others to verify your earned certificates"
            checked={v.showCertificatesPublicly}
            onChange={(val) => onChange({ privacy: { showCertificatesPublicly: val } }, "Privacy updated")} />
        </div>
      </Card>

      <div className="border-2 border-rose-200 bg-rose-50/30 rounded-xl">
        <div className="px-6 py-5 border-b border-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-rose-900">Danger zone</h2>
          </div>
          <p className="text-sm text-rose-700/70 mt-1">
            These actions are permanent and cannot be undone.
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Delete account</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md">
                Permanently deactivate your account. Your courses, certificates, and data will be retained for 30 days then removed.
              </p>
            </div>
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-300 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 transition shrink-0">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setConfirmDelete(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete your account?</h3>
            <p className="text-sm text-slate-600 mb-4">
              This action <span className="font-bold">cannot be undone</span>. Type{" "}
              <span className="font-mono font-bold text-rose-600">DELETE</span> to confirm.
            </p>
            <input type="text" value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full mb-5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition" />
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} disabled={deleting}
                className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60">
                Cancel
              </button>
              <button onClick={handleDelete}
                disabled={deleting || confirmText !== "DELETE"}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────────────── ATOMS (unchanged) ───────────────── */
function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-200 rounded-xl">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {desc && <p className="text-sm text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  )
}

function FormFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
      {children}
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, required, disabled, hint, icon, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; disabled?: boolean
  hint?: string; icon?: React.ReactNode; type?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="relative mt-1.5">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required} disabled={disabled}
          className={`w-full bg-white border border-slate-300 rounded-lg ${icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 transition disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed`} />
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </label>
  )
}

function PasswordField({
  label, value, onChange, show, onToggle,
}: {
  label: string; value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</span>
      <div className="relative mt-1.5">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type={show ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 transition" />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  )
}

function Toggle({
  label, desc, checked, onChange,
}: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked}
        className={`relative w-10 h-6 rounded-full transition shrink-0 ${
          checked ? "bg-[#6C3EF4]" : "bg-slate-200"
        }`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition ${
          checked ? "translate-x-4" : "translate-x-0"
        }`} />
      </button>
    </div>
  )
}