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

            'user_id' => $this->user_id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'comments' => $this->whenLoaded('comments'),
            'likes_count' => $this->likes_count,
            'comments_count' => $this->comments_count,
            'liked_by_me' => (bool) $this->liked_by_me,
        ];
    }
}
