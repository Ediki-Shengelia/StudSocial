import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { AuthContext } from "../auth/AuthContext";
import PostList from "../posts/PostList";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // helper to refetch posts (used after adding comment too)
  async function fetchPosts() {
    const pRes = await api.get(`/api/users/${id}/posts`);
    setPosts(pRes.data?.data ?? pRes.data);
  }

  useEffect(() => {
    let cancel = false;

    async function load() {
      setErr("");
      setLoading(true);

      try {
        const [uRes, pRes] = await Promise.all([
          api.get(`/api/users/${id}`),
          api.get(`/api/users/${id}/posts`),
        ]);

        if (cancel) return;

        setProfile(uRes.data);
        setPosts(pRes.data?.data ?? pRes.data);
      } catch (e) {
        if (!cancel) {
          setErr(e?.response?.data?.message || "Failed to load profile");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    load();
    return () => (cancel = true);
  }, [id]);

  // ✅ ADD COMMENT HANDLER (Profile passes this to PostList)
  async function handleAddComment(postId, payload) {
    // payload from PostList is: { comment: "text" }
    await api.post(`/api/posts/${postId}/comments`, payload);

    // refresh posts so comments_count updates
    await fetchPosts();
  }

  /* ===========================
     LOADING STATE
  ============================ */
  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
          <p className="mt-3 text-sm text-zinc-400">Loading profile…</p>
        </div>
      </div>
    );

  /* ===========================
     ERROR STATE
  ============================ */
  if (err)
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-200">
          {err}
        </div>
      </div>
    );

  /* ===========================
     NOT FOUND
  ============================ */
  if (!profile)
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center">
        <p className="text-zinc-400">Profile not found</p>
      </div>
    );

  const isOwner = user?.id === profile.id;

  const websiteHref = profile.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : "";

  /* ===========================
     MAIN PROFILE
  ============================ */
  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
          {/* Cover */}
          <div className="relative h-40 bg-gradient-to-br from-emerald-500/25 via-zinc-900 to-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_45%)]" />
          </div>

          {/* Body */}
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={profile.user_photo || "/default-avatar.png"}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-zinc-950 border border-white/10"
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <div className="pb-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">
                    {profile.name}
                  </h1>

                  {profile.location && (
                    <p className="mt-1 text-sm text-zinc-400">
                      📍 {profile.location}
                    </p>
                  )}
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="mb-2 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.7)] hover:bg-emerald-500"
                >
                  Edit profile
                </button>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-zinc-200 leading-relaxed break-words">
                {profile.bio}
              </p>
            )}

            {/* Meta Row */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300">
                Posts:
                <span className="ml-1 font-semibold text-white">
                  {profile.posts_count ?? posts.length}
                </span>
              </span>

              {profile.website && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-500/15"
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 {profile.website}
                </a>
              )}

              {!isOwner && (
                <span className="ml-auto text-xs text-zinc-500">
                  User ID: {profile.id}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Posts</h2>
            <div className="text-xs text-zinc-500">
              {posts.length} item{posts.length === 1 ? "" : "s"}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-10 text-center text-zinc-400">
              <p className="text-white/90 font-semibold">No posts yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                When {isOwner ? "you" : "this user"} posts something, it will
                show here.
              </p>

              {isOwner && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-5 rounded-2xl border border-white/10 bg-zinc-950/50 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-950"
                >
                  Go to dashboard
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* ✅ PASS onAddComment HERE */}
              <PostList posts={posts} onAddComment={handleAddComment} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}