import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postsApi } from "../posts/temp";
import { CircleLoader } from "react-spinners";

export default function ShowPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

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

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6 text-lg">
            <div className="flex items-center gap-2 text-red-500">
              ❤️ {post.likes_count ?? 0}
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              💬 {post.comments_count ?? 0}
            </div>
          </div>

          {/* Comments */}
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