<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'regular_price',
        'sale_price',
        'SKU',
        'stock_status',
        'featured',
        'has_variants',
        'quantity',
        'thumbnail',
        'images',
        'category_id',
        'brand_id',
        'has_variants',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'track_quantity' => 'boolean',
        'featured' => 'boolean',
        'digital' => 'boolean',
        'dimensions' => 'json',
    ];

    /**
     * Get the variants for the product.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that owns the product.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get all of the images for the Product.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get all videos for the product.
     */
    public function videos()
    {
        return $this->hasMany(ProductVideo::class)->ordered();
    }

    /**
     * Get active videos for the product.
     */
    public function activeVideos()
    {
        return $this->hasMany(ProductVideo::class)->active()->ordered();
    }

    /**
     * Get featured video for the product.
     */
    public function featuredVideo()
    {
        return $this->hasOne(ProductVideo::class)->where('is_featured', true)->where('is_active', true);
    }
}
