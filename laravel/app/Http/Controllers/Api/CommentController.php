<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $data = $request->validate([
            'comment' => 'required'
        ]);
        $comment = $post->comments()->create([
            'comment' => $data['comment'],
            'user_id' => auth()->id()
        ]);
        return new CommentResource($comment->load('user'));
    }
    public function destroy(Post $post, $commentId)
    {
        $comment = $post->comments()->findOrFail($commentId);
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json([
            'message' => "Comment deleted"
        ]);
    }
}
