<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'description'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    protected $appends = ['logo'];

    public function getLogoAttribute()
    {
        if (!$this->image) {
            return null;
        }
        $newPath = public_path('storage/uploads/brands/' . $this->image);
        $oldPath = public_path('storage/logos/' . $this->image);
        $publicRelative = file_exists($newPath)
            ? 'storage/uploads/brands/' . $this->image
            : 'storage/logos/' . $this->image;
        return asset($publicRelative);
    }
}
