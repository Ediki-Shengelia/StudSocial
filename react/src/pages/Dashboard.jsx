import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../auth/AuthContext";
import PostForm from "../posts/PostForm";
import PostList from "../posts/PostList";
import { usePost } from "../posts/usePost";
import NotificationsMenu from "./NotificationsMenu";
import Chat from "./Chat";

const Dashboard = () => {
  const { logout, bgColor, textColor } = useContext(AuthContext); 
  const navigate = useNavigate();

  const { createPost, deletePost, toggleLike, posts, err, addComment, setErr } = usePost();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function HandleCreate(payload) {
    setErr(""); setCreating(true);
    try { await createPost(payload); } 
    catch (error) { setErr(error?.message || "failed"); } 
    finally { setCreating(false); }
  }

  async function handleDelete(id) {
    setErr(""); setDeletingId(id);
    try { await deletePost(id); } 
    catch (error) { setErr(error?.message || "failed"); } 
    finally { setDeletingId(null); }
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <header 
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md"
        style={{ backgroundColor: `${bgColor}E6` }} // Adds 90% opacity to your custom color
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">S</div>
            <div>
              <h1 className="text-lg font-semibold leading-5">StudSocial</h1>
              <p className="text-xs opacity-60">Dashboard • Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:text-emerald-400 transition">
              <span className="font-serif font-bold">A</span>
            </button>
            <NotificationsMenu />
            <button onClick={logout} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
            <h2 className="text-base font-semibold text-emerald-400">Create a post</h2>
            <div className="mt-4"><PostForm onCreate={HandleCreate} creating={creating} /></div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">Live Chat <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span></h2>
            <div className="rounded-xl overflow-hidden bg-black/20"><Chat /></div>
          </div>
        </aside>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Posts</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-sm">
            <PostList posts={posts} onDelete={handleDelete} onLike={toggleLike} onAddComment={addComment} deletingId={deletingId} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;