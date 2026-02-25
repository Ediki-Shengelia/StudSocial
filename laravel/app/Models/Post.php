<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
  
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    protected $fillable = ['user_id', 'title', 'content', 'post_photo'];
}
