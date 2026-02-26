import { useEffect, useState } from "react";
import { postsApi } from "../posts/temp";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await postsApi.me();
        const u = res.data;

        if (!mounted) return;

        setForm({
          name: u.name || "",
          bio: u.bio || "",
          location: u.location || "",
          website: u.website || "",
        });

        setPreview(u.user_photo || "");
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load profile");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setOk("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("bio", form.bio);
      fd.append("location", form.location);
      fd.append("website", form.website);
      if (photo) fd.append("user_photo", photo);

      await postsApi.update(fd);

      setOk("Profile updated ✅");
      setPhoto(null);

      // go back AFTER success (or navigate to profile page if you want)
      navigate(-1);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Edit profile
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Update your photo and personal info.
          </p>
        </div>

        {/* Alerts */}
        {err && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}
        {ok && (
          <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {ok}
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Photo */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={preview || "https://via.placeholder.com/96"}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-200">
                    IMG
                  </div>
                </div>

                <div className="flex-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">
                    <span className="font-medium">Choose photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPickPhoto}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-2 text-xs text-zinc-500">
                    PNG/JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4">
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />

              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Tbilisi, Georgia"
              />

              <Field
                label="Website"
                name="website"
                value={form.website}
                onChange={onChange}
                placeholder="https://your-site.com"
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-200">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  placeholder="Write something about you (max 160)"
                  className="w-full min-h-28 resize-none rounded-2xl bg-zinc-950/60 px-4 py-3 text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-500/70"
                />
                <div className="mt-1 text-right text-xs text-zinc-500">
                  {form.bio.length}/160
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3 font-semibold text-zinc-200 hover:bg-zinc-900"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.7)] hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-200">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-2xl bg-zinc-950/60 px-4 py-3 text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-500/70"
      />
    </div>
  );
}