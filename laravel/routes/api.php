<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController as ApiLikeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',  [AuthController::class, 'user']);
    Route::apiResource('/posts', PostController::class);
    Route::post('posts/{post}/like', [ApiLikeController::class, 'like']);
    Route::delete('posts/{post}/like', [ApiLikeController::class, 'unlike']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/posts/{post}/comments/{comment}', [CommentController::class, 'destroy']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::post('/profile/me', [ProfileController::class, 'update']); // use POST for file upload
    Route::get('/users/{user}', [ProfileController::class, 'show']);

    Route::get('/users/{user}/posts', [ProfileController::class, 'posts']);
});
