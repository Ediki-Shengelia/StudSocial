<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;



class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public $message)
    {
        // We load the user relationship so the name is available
        $this->message->load('user');
    }

    public function broadcastOn(): array
    {
        return [new Channel('chat')];
    }

    // ADD THIS: This makes the event name exactly "MessageSent"
    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

    // ADD THIS: This ensures the structure is { "message": { "body": "...", "user": "..." } }
// MessageSent.php
public function broadcastWith(): array
{
    return [
        'message' => [
            'id'   => $this->message->id,
            'body' => $this->message->body,
            'user' => [
                'name' => $this->message->user->name ?? 'User'
            ], 
        ],
    ];
}
}
