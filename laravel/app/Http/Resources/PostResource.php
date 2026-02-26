<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'post_photo' => $this->post_photo
                ? asset('storage/' . $this->post_photo)
                : null,
            'user_id' => $this->user_id,   // ✅ make sure this exists

            'likes_count' => $this->likes_count ?? 0,
            'comments_count' => $this->comments_count,
            // when not loaded, default false
            'liked_by_me' => (bool) ($this->liked_by_me ?? false),
            // 'user' => new UserResource($this->whenLoaded('user'))
            'comments' => $this->whenLoaded('comments'),
            'user' => new UserResource($this->whenLoaded('user'))
        ];
    }
}
