import { postsApi } from "./temp";
import { useState, useEffect } from "react";
export function usePost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function fetchPosts() {
    setLoading(true);
    setErr("");
    try {
      const res = await postsApi.list();
      setPosts(res.data.data ?? res.data);
    } catch (error) {
      setErr(
        error.response.data.message || error.message || "failed to load posts",
      );
    } finally {
      setLoading(false);
    }
  }
  async function createPost(payload) {
    const res = await postsApi.create(payload);
    const newPost = res.data.data ?? res.data;
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }

  async function deletePost(id) {
    setErr("");
    await postsApi.remove(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function toggleLike(post) {
    const res = post.liked_by_me
      ? await postsApi.unlike(post.id)
      : await postsApi.like(post.id);

    const { likes_count, liked_by_me } = res.data;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, likes_count, liked_by_me } : p,
      ),
    );
  }
  async function addComment(postId, payload) {
    setErr("");
    try {
      const res = await postsApi.addComment(postId, payload);

      // backend may return comment directly or {data: comment}
      const newComm = res.data.data ?? res.data;

      // Update the post in state:
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;

          // If your post already has comments array:
          const oldComments = p.comments ?? [];
          return {
            ...p,
            comments: [newComm, ...oldComments],
            // optional: if you track count
            comments_count: (p.comments_count ?? oldComments.length) + 1,
          };
        }),
      );

      return newComm;
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "failed to add comment",
      );
      throw error;
    }
  }
  useEffect(() => {
    fetchPosts();
  }, []);
  return {
    createPost,
    deletePost,
    loading,
    toggleLike,
    addComment,
    posts,
    err,
    setErr,
  };
}
