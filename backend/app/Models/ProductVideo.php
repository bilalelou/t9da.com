<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductVideo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_id',
        'title',
        'description',
        'video_url',
        'video_type',
        'thumbnail',
        'duration',
        'file_size',
        'resolution',
        'sort_order',
        'is_featured',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'duration' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Get the product that owns the video.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the full URL for the video based on type.
     */
    public function getFullVideoUrlAttribute()
    {
        switch ($this->video_type) {
            case 'youtube':
                return "https://www.youtube.com/watch?v={$this->video_url}";
            case 'vimeo':
                return "https://vimeo.com/{$this->video_url}";
            case 'file':
            default:
                return asset('storage/' . $this->video_url);
        }
    }

    /**
     * Get the embed URL for the video.
     */
    public function getEmbedUrlAttribute()
    {
        switch ($this->video_type) {
            case 'youtube':
                return "https://www.youtube.com/embed/{$this->video_url}";
            case 'vimeo':
                return "https://player.vimeo.com/video/{$this->video_url}";
            case 'file':
            default:
                return $this->full_video_url;
        }
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            return asset('storage/' . $this->thumbnail);
        }

        // Generate thumbnail based on video type
        switch ($this->video_type) {
            case 'youtube':
                return "https://img.youtube.com/vi/{$this->video_url}/maxresdefault.jpg";
            case 'vimeo':
                // For Vimeo, we'd need to make an API call to get thumbnail
                return "https://vumbnail.com/{$this->video_url}.jpg";
            default:
                return asset('images/video-placeholder.jpg');
        }
    }

    /**
     * Get formatted duration.
     */
    public function getFormattedDurationAttribute()
    {
        if (!$this->duration) return null;

        $hours = floor($this->duration / 3600);
        $minutes = floor(($this->duration % 3600) / 60);
        $seconds = $this->duration % 60;

        if ($hours > 0) {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        } else {
            return sprintf('%02d:%02d', $minutes, $seconds);
        }
    }

    /**
     * Get formatted file size.
     */
    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size) return null;

        $size = (int)$this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }

        return round($size, 2) . ' ' . $units[$i];
    }

    /**
     * Scope for active videos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured videos.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for ordered videos.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'asc');
    }
}
