import { api } from "../lib/api";

export const postsApi = {
  list: () => api.get("/api/posts"),
  create: (payload) => api.post("/api/posts", payload),
  remove: (id) => api.delete(`/api/posts/${id}`),
  show: (id) => api.get(`/api/posts/${id}`),
  like: (post) => api.post(`/api/posts/${post}/like`),
  unlike: (post) => api.delete(`/api/posts/${post}/like`),
  addComment: (postId, payload) =>
    api.post(`/api/posts/${postId}/comments`, payload),
  removeComment: (postId, commentId) =>
    api.delete(`/api/posts/${postId}/comments/${commentId}`),
  me: () => api.get("/api/profile/me"),
  update: (formData) =>
    api.post("/api/profile/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  restorePassword: (payload) => api.post("/api/restore/user", payload),
  checkEmail: (email) => api.get(`/api/check-email`, { params: { email } }),
};
