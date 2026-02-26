import { api } from "../lib/api";

export const notificationsApi = {
  listNot() {
    return api.get("/api/notifications");
  },
  markRead(id) {
    return api.post(`/api/notifications/${id}/read`);
  },
  markAllRead() {
    return api.post("/api/notifications/read-all");
  },
};