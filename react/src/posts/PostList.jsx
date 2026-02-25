import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const PostList = ({ posts, onDelete, deletingId, onLike }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="w-full px-9 py-2">
      {posts.map((post) => (
        <div
          onClick={() => navigate(`/posts/show/${post.id}`)}
          key={post.id}
          className=" border-2 mt-4 flex bg-zinc-600 rounded-lg shadow-lg shadow-red-100 flex-col gap-2 w-full p-3 mx-auto"
        >
          <div className="rounded-2xl relative  w-full ">
            <p className="text-center bg-white w-fit mx-auto py-2 rounded-2xl px-4 my-2">
              {post.title}
            </p>
            {user?.id === post.user_id && (
              <button
                className="bg-red-500 absolute top-0 right-2 text-black text-sm font-bold hover:scale-105 w-fit px-2 py-1 rounded-2xl"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ important
                  onDelete(post.id);
                }}
              >
                {deletingId === post.id ? "Deleting" : "delete"}
              </button>
            )}
            {/* <p>{post.content}</p> */}
          </div>

          <div className="mx-auto w-fit">
            {post.post_photo && <img src={post.post_photo} width="200" />}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(post);
              // console.log("works");
              
            }}
            className={`text-2xl ${post.liked_by_me ? "text-red-500" : "text-gray-400"}`}
          >
            {post.liked_by_me ? "❤️" : "🤍"} {post.likes_count ?? 0}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
