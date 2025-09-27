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
        'has_free_shipping',
        'free_shipping_note',
    ];

    protected $casts = [
        'regular_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'featured' => 'boolean',
        'has_variants' => 'boolean',
        'quantity' => 'integer',
        'has_free_shipping' => 'boolean',
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

    /**
     * Get all reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Get verified reviews for the product.
     */
    public function verifiedReviews()
    {
        return $this->hasMany(ProductReview::class)->where('is_verified', true);
    }

    /**
     * Get average rating for the product.
     */
    public function getAverageRatingAttribute()
    {
        return $this->verifiedReviews()->avg('rating') ?: 0;
    }

    /**
     * Get total reviews count.
     */
    public function getTotalReviewsAttribute()
    {
        return $this->verifiedReviews()->count();
    }

    /**
     * Get rating breakdown (count for each star rating).
     */
    public function getRatingBreakdownAttribute()
    {
        $breakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $breakdown[$i] = $this->verifiedReviews()->where('rating', $i)->count();
        }
        return $breakdown;
    }

    /**
     * Scope للمنتجات التي لها شحن مجاني
     */
    public function scopeFreeShipping($query)
    {
        return $query->where('has_free_shipping', true);
    }

    /**
     * Scope للمنتجات التي ليس لها شحن مجاني
     */
    public function scopePaidShipping($query)
    {
        return $query->where('has_free_shipping', false);
    }

    /**
     * Check if product has free shipping
     */
    public function hasFreeShipping()
    {
        return $this->has_free_shipping;
    }

    /**
     * Get shipping cost for this product
     */
    public function getShippingCost($cityPrice = 0)
    {
        return $this->has_free_shipping ? 0 : $cityPrice;
    }
}
