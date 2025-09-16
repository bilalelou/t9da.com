<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'total',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // public function review()
    // {
    //     return $this->hasOne(review::class,'order_item_id');
    // }

    // دوال مساعدة
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' درهم';
    }

    public function getFormattedTotalAttribute()
    {
        return number_format($this->total, 2) . ' درهم';
    }
}
