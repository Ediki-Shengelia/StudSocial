import { api } from "../lib/api";

export const postsApi = {
  list: () => api.get("/api/posts"),
  create: (payload) => api.post("/api/posts", payload),
  remove: (id) => api.delete(`/api/posts/${id}`),
};
