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
  useEffect(() => {
    fetchPosts();
  }, []);
  return { createPost, deletePost, loading, posts, err, setErr };
}
