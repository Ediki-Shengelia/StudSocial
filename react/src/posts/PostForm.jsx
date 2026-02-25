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
    if (photo) {
      formData.append("post_photo", photo);
    }
    await onCreate(formData);

    setTitle("");
    setPhoto(null);
    setContent("");
  }
  return (
    <form
      onSubmit={submit}
      className="bg-amber-200 flex flex-col gap-2 w-fit mx-auto"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ADD title"
        className="bg-red-400 placeholder:text-black w-full rounded-lg focus:placeholder:text-green-400 focus:bg-amber-950 px-4 focus:text-white placeholder:text-center py-1"
      />
      <input
        type="text"
        value={content}
        className="bg-red-400 placeholder:text-black w-full rounded-lg focus:placeholder:text-green-400 focus:bg-amber-950 px-4 focus:text-white placeholder:text-center py-1"
        onChange={(e) => setContent(e.target.value)}
        placeholder="ADD Content"
      />
      <div className="flex flex-col items-center gap-2">
        <input
          type="file"
          id="photo"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="hidden"
        />

        <label
          htmlFor="photo"
          className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Choose Photo
        </label>

        {photo && <p className="text-sm text-gray-600">{photo.name}</p>}
      </div>{" "}
      <button className="bg-amber-300 w-full py-2 hover:scale-105 hover:text-red-600 rounded-2xl hover:bg-amber-600 text-2xl cursor-pointer">{creating ? "creating post" : "create post"}</button>
    </form>
  );
};

export default PostForm;
