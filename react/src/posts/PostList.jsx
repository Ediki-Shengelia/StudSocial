import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
const PostList = ({ posts, onDelete, deletingId }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full px-9 py-2">
      {posts.map((post) => (
        <div
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
                onClick={() => onDelete(post.id)}
              >
                {deletingId === post.id ? "Deleting" : "delete"}
              </button>
            )}
            {/* <p>{post.content}</p> */}
          </div>

          <div className="mx-auto w-fit">
            {post.post_photo && <img src={post.post_photo} width="200" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
