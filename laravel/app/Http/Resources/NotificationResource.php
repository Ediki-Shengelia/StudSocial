<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'post_id' => $this->data['post_id'] ?? null,
            'message' => $this->data['message'] ?? null,
            'liked_by_name' => $this->data['liked_by_name'] ?? null,
            'created_at' => $this->created_at,
            'is_read' => $this->read_at !== null,
        ];
    }
}
