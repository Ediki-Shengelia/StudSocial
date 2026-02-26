<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ProfileResource;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Request;

class ProfileController extends Controller
{
    public function show(User $user)
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'user_photo' => $user->user_photo ? asset('storage/' . $user->user_photo) : null,
            'posts_count' => $user->posts()->count(),
        ]);
    }

    public function posts(User $user)
    {
        $posts = $user->posts()
            ->latest()
            ->with('user')
            ->withCount(['likes', 'comments'])
            ->get();

        return response()->json(['data' => $posts]);
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
