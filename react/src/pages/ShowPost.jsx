import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postsApi } from "../posts/temp"; // adjust path
import {CircleLoader} from 'react-spinners'
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
        const data = res.data?.data ?? res.data; // works for Resource or plain JSON
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load post");
      }
    }

    load();
    return () => (cancelled = true);
  }, [id]);

  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!post) return <div className="flex justify-center items-center h-screen">
    <CircleLoader/>
  </div>; // ✅ prevents crash

  return (
    <div className="p-6">
      <Link to={-1} className="underline">← Back</Link>

      <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
      <p className="mt-2">{post.content}</p>

      {post.post_photo && (
        <img className="mt-4 max-w-md" src={post.post_photo} alt="" />
      )}
    </div>
  );
}