<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'color_id',
        'size_id',
        'sku',
        'price',
        'compare_price',
        'quantity',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the variant.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the color that owns the variant.
     */
    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    /**
     * Get the size that owns the variant.
     */
    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    /**
     * Scope a query to only include active variants.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the variant's full display name.
     */
    public function getDisplayNameAttribute()
    {
        $parts = [];

        if ($this->color) {
            $parts[] = $this->color->name;
        }

        if ($this->size) {
            $parts[] = $this->size->display_name;
        }

        return implode(' - ', $parts);
    }
}
