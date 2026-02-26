<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();
        $posts = Post::query()
            ->with(['user', 'comments.user']) // 🔥 ADD THIS

            ->withCount(['likes', 'comments'])
            ->when($userId, fn($q) =>
            $q->withExists([
                'likes as liked_by_me' => fn($qq) => $qq->where('user_id', $userId)
            ]))->latest()->get();
        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        if ($request->hasFile('post_photo')) {
            $data['post_photo'] = $request->file('post_photo')
                ->store('posts', "public");
        }
        $data['user_id'] = auth()->id();
        $post = $request->user()->posts()->create($data);
        return new PostResource($post);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $userId = auth()->id();

        $post->load([
            'comments.user'   // loads comments and comment authors
        ]);

        $post->loadCount([
            'likes',
            'comments'        // adds comments_count
        ]);

        if ($userId) {
            $post->liked_by_me = $post->likes()
                ->where('user_id', $userId)
                ->exists();
        } else {
            $post->liked_by_me = false;
        }

        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // $this->authorize('update', $post);

        // $data = $request->validate([
        //     'title' => 'sometimes',
        //     'content' => 'sometimes',
        //     'post_photo' => 'nullable'
        // ]);

        // $post->update($data);

        // return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        // delete photo if exists
        if ($post->post_photo) {
            Storage::disk('public')->delete($post->post_photo);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
}
