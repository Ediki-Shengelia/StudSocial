import React, { useState } from "react";

const PostForm = ({ onCreate, creating }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);

  async function submit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (photo) formData.append("post_photo", photo);

    await onCreate(formData);

    setTitle("");
    setContent("");
    setPhoto(null);

    // optional: clear file input visually
    e.target.reset();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg shadow-black/30 space-y-3"
    >
      <div>
        <label className="text-xs text-zinc-400">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write a title..."
          className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                     ring-1 ring-white/10 placeholder:text-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What’s on your mind?"
          rows={3}
          className="mt-1 w-full resize-none rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                     ring-1 ring-white/10 placeholder:text-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        />
      </div>

      {/* File input */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="photo"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          <label
            htmlFor="photo"
            className="cursor-pointer rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-zinc-200
                       ring-1 ring-white/10 hover:bg-white/15 transition"
          >
            {photo ? "Change Photo" : "Choose Photo"}
          </label>

          <span className="text-xs text-zinc-400">
            {photo ? photo.name : "Optional"}
          </span>
        </div>

        {photo && (
          <button
            type="button"
            onClick={() => setPhoto(null)}
            className="text-xs text-red-300 hover:text-red-200 transition"
          >
            Remove
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={creating}
        className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white
                   hover:bg-emerald-500 active:scale-[0.99] transition
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {creating ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
};

export default PostForm;