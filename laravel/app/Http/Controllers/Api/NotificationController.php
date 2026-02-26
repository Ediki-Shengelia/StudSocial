<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'unread' => NotificationResource::collection(
                $user->unreadNotifications
            ),
            'read' => NotificationResource::collection(
                $user->readNotifications()->latest()->take(20)->get()
            ),
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }
    public function markAsRead(Request $request, string $id)
    {
        $n = $request->user()->notifications()->where('id', $id)->firstOrFail();
        $n->markAsRead();
        return response()->json(['ok' => true]);
    }
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['ok' => true]);
    }
}
