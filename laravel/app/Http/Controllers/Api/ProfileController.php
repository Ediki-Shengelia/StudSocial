<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\PostResource;
use App\Models\User;
use App\Models\Post; // ✅ ADD THIS
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Request;

class ProfileController extends Controller
{

    public function show(User $user)
    {
        return new ProfileResource($user);
    }
    public function posts(User $user)
    {
        $authId = auth()->id();

        $posts = $user->posts()
            ->with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->when($authId, function ($query) use ($authId) {
                $query->withExists([
                    'likes as liked_by_me' => fn($q) =>
                    $q->where('user_id', $authId)
                ]);
            })
            ->latest()
            ->get();

        return \App\Http\Resources\PostResource::collection($posts);
    }
    public function me(Request $request)
    {
        return $this->formatUser($request->user());
    }

    public function update(UpdateUserRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();

        // upload photo if exists
        if ($request->hasFile('user_photo')) {
            // delete old photo (optional)
            if ($user->user_photo) {
                Storage::disk('public')->delete($user->user_photo);
            }

            $path = $request->file('user_photo')->store('avatars', 'public');
            $user->user_photo = $path;
        }

        // update other fields
        foreach (['name', 'bio', 'location', 'website'] as $field) {
            if (array_key_exists($field, $data)) {
                $user->{$field} = $data[$field];
            }
        }

        $user->save();

        return $this->formatUser($user);
    }

    private function formatUser(User $user)
    {
        return new ProfileResource($user);
    }
}
