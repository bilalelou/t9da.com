<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'type', // percentage, fixed
        'value',
        'min_amount',
        'max_amount',
        'usage_limit',
        'times_used',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'value' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
    ];

    // دوال مساعدة
    public function isValid()
    {
        return $this->is_active && 
               ($this->expires_at === null || $this->expires_at->isFuture()) &&
               ($this->usage_limit === null || $this->times_used < $this->usage_limit);
    }

    public function canBeUsed()
    {
        return $this->isValid();
    }

    public function getDiscountAmount($subtotal)
    {
        if (!$this->canBeUsed()) {
            return 0;
        }

        if ($subtotal < $this->min_amount) {
            return 0;
        }

        $discount = 0;
        if ($this->type === 'percentage') {
            $discount = ($subtotal * $this->value) / 100;
            if ($this->max_amount && $discount > $this->max_amount) {
                $discount = $this->max_amount;
            }
        } else {
            $discount = $this->value;
        }

        return min($discount, $subtotal);
    }

    public function incrementUsage()
    {
        $this->increment('times_used');
    }

    // نطاقات (Scopes)
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', Carbon::now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('usage_limit')
                          ->orWhereRaw('times_used < usage_limit');
                    });
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }
}
