<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'media_path',
        'end_date',
        'position',
        'status',
    ];
}
