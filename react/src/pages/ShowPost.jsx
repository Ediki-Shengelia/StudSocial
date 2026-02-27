import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { postsApi } from "../posts/temp";
import { AuthContext } from "../auth/AuthContext";
import { CircleLoader } from "react-spinners";

export default function ShowPost() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setErr("");
      try {
        const res = await postsApi.show(id);
        const data = res.data?.data ?? res.data;
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled)
          setErr(e?.response?.data?.message || "Failed to load post");
      }
    }

    load();
    return () => (cancelled = true);
  }, [id]);

  // ============================
  // ❤️ LIKE / UNLIKE
  // ============================

  async function handleLike() {
    if (!post) return;

    setLoadingLike(true);

    try {
      const res = post.liked_by_me
        ? await postsApi.unlike(post.id)
        : await postsApi.like(post.id);

      setPost((prev) => ({
        ...prev,
        likes_count: res.data.likes_count,
        liked_by_me: res.data.liked_by_me,
      }));
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingLike(false);
    }
  }

  // ============================
  // 💬 ADD COMMENT
  // ============================

  async function handleAddComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSendingComment(true);

    try {
      const res = await postsApi.addComment(post.id, {
        comment: commentText,
      });

      const newComment = res.data?.data ?? res.data;

      setPost((prev) => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])],
        comments_count: (prev.comments_count || 0) + 1,
      }));

      setCommentText("");
    } catch (e) {
      console.log(e);
    } finally {
      setSendingComment(false);
    }
  }

  // ============================
  // STATES
  // ============================

  if (err)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-400">
        {err}
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <CircleLoader color="#10b981" />
      </div>
    );

  // ============================
  // UI
  // ============================

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to={-1}
          className="text-sm text-zinc-400 hover:text-emerald-400 transition"
        >
          ← Back
        </Link>

        {/* Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-6 shadow-xl shadow-black/40">

          {/* Title */}
          <h1 className="text-2xl font-bold text-center">
            {post.title}
          </h1>

          {/* Content */}
          <p className="mt-4 text-zinc-300 text-center">
            {post.content}
          </p>

          {/* Image */}
          {post.post_photo && (
            <div className="mt-6 flex justify-center">
              <img
                src={post.post_photo}
                alt=""
                className="rounded-xl max-h-96 object-cover shadow-lg ring-1 ring-white/10"
              />
            </div>
          )}

          {/* ❤️ Likes + Comments Count */}
          <div className="flex justify-center gap-8 mt-6 text-lg">

          <button
  onClick={handleLike}
  disabled={loadingLike}
  className="flex items-center gap-2 text-lg transition"
>
  {post.liked_by_me ? "❤️" : "🤍"}
  {post.likes_count ?? 0}
</button>

            <div className="flex items-center gap-2 text-zinc-300">
              💬 {post.comments_count ?? 0}
            </div>
          </div>

          {/* 💬 Add Comment */}
          {user && (
            <form onSubmit={handleAddComment} className="mt-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-zinc-800 rounded-xl p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={sendingComment}
                className="mt-3 px-4 py-2 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
              >
                {sendingComment ? "Sending..." : "Add Comment"}
              </button>
            </form>
          )}

          {/* Comments List */}
          <h2 className="text-lg font-semibold mt-8 border-b border-white/10 pb-2">
            Comments
          </h2>

          {post.comments?.length ? (
            <div className="mt-4 space-y-4">
              {post.comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-zinc-800/70 p-4 border border-white/10"
                >
                  <p className="text-sm text-emerald-400 font-medium">
                    {c.user?.name ?? "Anonymous"}
                  </p>
                  <p className="mt-2 text-zinc-200">
                    {c.comment ?? c.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-zinc-500">No comments yet.</p>
          )}

        </div>
      </div>
    </div>
  );
}