<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class MessageController extends Controller
{
    // Fixes the 405 error
    public function index()
    {
        return Message::with('user')->latest()->take(50)->get()->reverse()->values();
    }

    // Fixes the 500 error
    public function store(Request $request)
    {
        try {
            $message = Message::create([
                'user_id' => auth()->id() ?? 1,
                'body' => $request->body,
            ]);

            $message->load('user');

            broadcast(new MessageSent($message))->toOthers();

            return $message;
        } catch (\Exception $e) {
            Log::error("Chat Store Failed: " . $e->getMessage());
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
}
