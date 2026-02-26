import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const PostList = ({
  posts = [],
  onDelete,
  deletingId,
  onLike,
  onAddComment,
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comments, setComments] = useState({});
  const [sendingFor, setSendingFor] = useState({}); // { [postId]: true }
  const [errFor, setErrFor] = useState({}); // { [postId]: "error" }

  async function handleAddComment(e, postId) {
    e.stopPropagation();

    if (!onAddComment) return;

    const text = (comments[postId] || "").trim();
    if (!text) return;

    setErrFor((p) => ({ ...p, [postId]: "" }));
    setSendingFor((p) => ({ ...p, [postId]: true }));

    try {
      await onAddComment(postId, { comment: text });
      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      setErrFor((p) => ({
        ...p,
        [postId]:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add comment",
      }));
    } finally {
      setSendingFor((p) => ({ ...p, [postId]: false }));
    }
  }

  function openUserProfile(e, post) {
    e.stopPropagation();
    const uid = post?.user?.id ?? post?.user_id;
    if (uid) navigate(`/profile/${uid}`);
  }

  return (
    <div className="w-full space-y-4">
      {posts.map((post) => {
        const ownerId = post?.user_id ?? post?.user?.id;
        const isOwner = user?.id === ownerId;

        return (
          <div
            key={post.id}
            onClick={() => navigate(`/posts/show/${post.id}`)}
            className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-5 transition
                       hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            {/* Header row */}
            <div className="relative">
              <button
                onClick={(e) => openUserProfile(e, post)}
                className="text-sm font-medium px-3 py-1 rounded-full 
                           bg-emerald-500/10 text-emerald-400 
                           ring-1 ring-emerald-500/30 hover:bg-emerald-500/15 transition"
              >
                @{post?.user?.name ?? "user"}
              </button>

              <p className="text-lg font-semibold text-white text-center">
                {post.title}
              </p>

              {/* Delete only if handler exists */}
              {onDelete && isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post.id);
                  }}
                  className="absolute right-0 top-0 rounded-xl bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-200
                             ring-1 ring-red-500/30 hover:bg-red-500/25 transition"
                >
                  {deletingId === post.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>

            {/* Image */}
            {post.post_photo && (
              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                <img
                  src={post.post_photo}
                  alt=""
                  className="mx-auto max-h-72 w-full max-w-md rounded-xl object-cover shadow-lg shadow-black/40 ring-1 ring-white/10"
                />
              </div>
            )}

            {/* Like + comments count */}
            <div className="mt-4 flex items-center justify-center gap-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!onLike) return;
                  onLike(post);
                }}
                disabled={!onLike}
                className={`flex items-center gap-2 text-lg font-medium transition ${
                  !onLike
                    ? "text-zinc-500 cursor-not-allowed"
                    : post.liked_by_me
                    ? "text-red-500"
                    : "text-zinc-400 hover:text-red-400"
                }`}
                title={!onLike ? "Like is disabled on this page" : "Like"}
              >
                <span className="text-2xl">{post.liked_by_me ? "❤️" : "🤍"}</span>
                <span>{post.likes_count ?? 0}</span>
              </button>

              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-xl">💬</span>
                <span className="text-lg font-medium">
                  {post.comments_count ?? 0}
                </span>
              </div>
            </div>

            {/* Comment input */}
            <div onClick={(e) => e.stopPropagation()} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    onAddComment ? "Write a comment..." : "Comments disabled"
                  }
                  value={comments[post.id] || ""}
                  disabled={!onAddComment || !!sendingFor[post.id]}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment(e, post.id);
                  }}
                  className="flex-1 rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                             ring-1 ring-white/10 placeholder:text-zinc-500
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/70
                             disabled:opacity-60"
                />

                <button
                  onClick={(e) => handleAddComment(e, post.id)}
                  disabled={!onAddComment || !!sendingFor[post.id]}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
                             hover:bg-emerald-500 active:scale-[0.99] transition
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendingFor[post.id] ? "Adding..." : "Add"}
                </button>
              </div>

              {errFor[post.id] && (
                <p className="mt-2 text-xs text-red-300">{errFor[post.id]}</p>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-zinc-500">
              Click the card to open the post
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;