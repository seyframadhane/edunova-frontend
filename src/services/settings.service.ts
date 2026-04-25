import { api } from "./api"

export interface UserSettings {
  notifications: {
    emailCourse: boolean
    emailNewsletter: boolean
    emailMarketing: boolean
    pushCourse: boolean
    pushReminders: boolean
    pushMarketing: boolean
  }
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
  }
  privacy: {
    showOnLeaderboard: boolean
    showCertificatesPublicly: boolean
  }
}

export type PartialSettings = {
  notifications?: Partial<UserSettings["notifications"]>
  preferences?: Partial<UserSettings["preferences"]>
  privacy?: Partial<UserSettings["privacy"]>
}

export const settingsService = {
  /** Update any subset of settings. Returns the new full settings object. */
  update: (patch: PartialSettings) =>
    api.patch("/users/me/settings", patch).then((r) => r.data.data as UserSettings),

  /** Request a full account export (returns a JSON snapshot). */
  exportData: () =>
    api.post("/users/me/export").then((r) => r.data.data),

  /** Permanently deactivate the account. */
  deleteAccount: () =>
    api.delete("/users/me", { data: { confirm: "DELETE" } }),
}