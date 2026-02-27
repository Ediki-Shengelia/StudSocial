import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { postsApi } from "../posts/temp";
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

  async function fetchPosts() {
    const pRes = await api.get(`/api/users/${id}/posts`);
    setProfile(uRes.data?.data ?? uRes.data);
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

        setProfile(uRes.data?.data ?? uRes.data);
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

  /*
  |--------------------------------------------------------------------------
  | LIKE / UNLIKE HANDLER (Optimistic UI)
  |--------------------------------------------------------------------------
  */

  async function handleLike(post) {
    const postId = post.id;
    const isLiked = post.liked_by_me;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by_me: !isLiked,
              likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p,
      ),
    );

    try {
      if (isLiked) {
        await postsApi.unlike(postId);
      } else {
        await postsApi.like(postId);
      }
    } catch (error) {
      // revert if API fails
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked_by_me: isLiked,
                likes_count: isLiked ? p.likes_count + 1 : p.likes_count - 1,
              }
            : p,
        ),
      );
    }
  }
  /*
  |--------------------------------------------------------------------------
  | COMMENT HANDLER
  |--------------------------------------------------------------------------
  */

  async function handleAddComment(postId, payload) {
    await postsApi.addComment(postId, payload);
    await fetchPosts();
  }

  /* ================= LOADING ================= */

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
          <p className="mt-3 text-sm text-zinc-400">Loading profile…</p>
        </div>
      </div>
    );

  if (err)
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-200">
          {err}
        </div>
      </div>
    );

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

  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur">
          <div className="relative h-40 bg-gradient-to-br from-emerald-500/25 via-zinc-900 to-zinc-950" />
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={profile.user_photo || "/default-avatar.png"}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-zinc-950 border border-white/10"
                  alt=""
                />
                <div className="pb-2">
                  <h1 className="text-2xl font-semibold text-white">
                    {profile.name}
                  </h1>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="mb-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Edit profile
                </button>
              )}
            </div>

            {profile.bio && <p className="mt-4 text-zinc-200">{profile.bio}</p>}
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-8 space-y-4">
          <PostList
            posts={posts}
            onLike={handleLike} // 🔥 PASS LIKE
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
}
