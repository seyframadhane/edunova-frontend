import { api } from "../../services/api";

export const adminApi = {
  createCourse: (payload: any) => {
    // If payload is FormData (for file upload), send it as-is
    if (payload instanceof FormData) {
      return api.post("/admin/courses", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(r => r.data);
    }
    // Otherwise, send as JSON
    return api.post("/admin/courses", payload).then(r => r.data);
  },
  updateCourse: (id: string, payload: any) => api.patch(`/admin/courses/${id}`, payload).then(r => r.data),
  deleteCourse: (id: string) => api.delete(`/admin/courses/${id}`).then(r => r.data),

  createInstructor: (payload: any) => api.post("/admin/instructors", payload).then(r => r.data),
  listInstructors: () => api.get("/admin/instructors").then(r => r.data),
  updateInstructor: (id: string, payload: any) => api.patch(`/admin/instructors/${id}`, payload).then(r => r.data),

  broadcastNotification: (payload: any) =>
    api.post("/admin/notifications/broadcast", payload).then(r => r.data),
};
