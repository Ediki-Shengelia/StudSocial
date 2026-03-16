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

   public function store(Request $request)
{
    $user = auth()->user();

    $message = $user->messages()->create([
        'body' => $request->body,
    ]);

    // Manually attach the user object without a new DB query
    $message->setRelation('user', $user);

    // Broadcast instantly
    broadcast(new MessageSent($message))->toOthers();

    return $message;
}
}
