<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;

class LikeController extends Controller
{
    public function like(Post $post)
    {
        $post->likes()->firstOrCreate([
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'likes_count' => $post->likes()->count(),
            'liked_by_me' => true,
        ]);
    }

    public function unlike(Post $post)
    {
        $post->likes()->where('user_id', auth()->id())->delete();

        return response()->json([
            'likes_count' => $post->likes()->count(),
            'liked_by_me' => false,
        ]);
    }
}