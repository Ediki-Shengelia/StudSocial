import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import PostForm from "../posts/PostForm";
import PostList from "../posts/PostList";
import { usePost } from "../posts/usePost";
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const { createPost, deletePost, loading, posts, err, setErr, updatePost } =
    usePost();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  async function HandleCreate(payload) {
    setErr("");
    setCreating(true);
    try {
      await createPost(payload);
    } catch (error) {
      setErr(
        error.response.data.message ||
          error.message ||
          "failed to create posts",
      );
    } finally {
      setCreating(false);
    }
  }
  async function HandleUpdate(id, payload) {
    setErr("");
    setUpdatingId(id);

    try {
      await updatePost(id, payload);
    } catch (error) {
      setErr(error?.response?.data?.message || "update failed");
    } finally {
      setUpdatingId(null);
    }
  }
  async function handleDelete(id) {
    setErr("");
    setDeletingId(id);
    try {
      await deletePost(id);
    } catch (error) {
      setErr(
        error.response.data.message ||
          error.message ||
          "failed to delete posts",
      );
    } finally {
      setDeletingId(null);
    }
  }
  return (
    <div>
      <h1 className="text-2xl  mb-2 bg-green-300 px-4 py-1 rounded-t-full">Posts</h1>
      <button onClick={logout} className="bg-black text-white fixed top-2 right-1 px-2 py-1 rounded-2xl hover:scale-105 cursor-pointer">Logout</button>
      <PostForm onCreate={HandleCreate} creating={creating} />
      {err ? <p>{err}</p> : null}
      <PostList posts={posts} onDelete={handleDelete} onUpdate={HandleUpdate}   updatingId={updatingId} deletingId={deletingId} />
    </div>
  );
};

export default Dashboard;
