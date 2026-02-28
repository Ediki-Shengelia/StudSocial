import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import PostForm from "../posts/PostForm";
import PostList from "../posts/PostList";
import { usePost } from "../posts/usePost";
import NotificationsMenu from "./NotificationsMenu";
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const {
    createPost,
    deletePost,
    toggleLike,
    posts,
    err,
    addComment,
    setErr,
    updatePost,
  } = usePost();

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // const [updatingId, setUpdatingId] = useState(null);

  async function HandleCreate(payload) {
    setErr("");
    setCreating(true);
    try {
      await createPost(payload);
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "failed to create posts",
      );
    } finally {
      setCreating(false);
    }
  }

  // async function HandleUpdate(id, payload) {
  //   setErr("");
  //   setUpdatingId(id);
  //   try {
  //     await updatePost(id, payload);
  //   } catch (error) {
  //     setErr(error?.response?.data?.message || "update failed");
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // }

  async function handleDelete(id) {
    setErr("");
    setDeletingId(id);
    try {
      await deletePost(id);
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "failed to delete posts",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-300 font-bold">S</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-5">StudSocial</h1>
              <p className="text-xs text-zinc-400">Dashboard • Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsMenu />

            <button
              onClick={logout}
              className="cursor-pointer rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 active:scale-[0.99] transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
        {/* Left column */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30">
            <h2 className="text-base font-semibold">Create a post</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Share something with your feed.
            </p>

            <div className="mt-4">
              <PostForm onCreate={HandleCreate} creating={creating} />
            </div>

            {creating ? (
              <p className="mt-3 text-xs text-emerald-300">Creating…</p>
            ) : null}
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <div className="font-semibold">Something went wrong</div>
              <div className="mt-1 opacity-90">{err}</div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <div className="font-semibold">Tips</div>
            <ul className="mt-2 list-disc pl-5 text-zinc-400 space-y-1">
              <li>Click a post to open it.</li>
              <li>Use ❤️ to like, 💬 to comment.</li>
              <li>Only your posts show the delete button.</li>
            </ul>
          </div>
        </aside>

        {/* Feed */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">Posts</h2>
              <p className="text-sm text-zinc-400">
                Latest updates from the community
              </p>
            </div>

            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
              {posts?.length ?? 0} posts
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 sm:p-3 shadow-lg shadow-black/30">
            <PostList
              posts={posts}
              onDelete={handleDelete}
              onLike={toggleLike} // ✅ toggleLike(post)
              onAddComment={addComment}
              deletingId={deletingId}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
