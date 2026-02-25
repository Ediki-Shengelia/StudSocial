<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commet extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function Post()
    {
        return $this->belongsTo(Post::class);
    }
    protected $fillable = ['comment', 'post_id', 'user_id'];
}
