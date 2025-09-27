<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = [
        'name',
        'price',
        'duration',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Scope للمدن النشطة فقط
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope لترتيب المدن حسب الاسم
    public function scopeOrderByName($query)
    {
        return $query->orderBy('name');
    }

    // Scope لترتيب المدن حسب السعر
    public function scopeOrderByPrice($query)
    {
        return $query->orderBy('price');
    }
}
