<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Notification extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type',
        'priority',
        'user_id',
        'order_id',
        'data',
        'read_at',
        'is_read',
        'action_url'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'is_read' => 'boolean',
    ];

    // العلاقات
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays($days));
    }

    // Methods
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => Carbon::now()
        ]);
    }

    public function markAsUnread()
    {
        $this->update([
            'is_read' => false,
            'read_at' => null
        ]);
    }

    // Static Methods لإنشاء إشعارات مختلفة
    public static function createOrderNotification($orderId, $title, $message, $priority = 'medium')
    {
        return self::create([
            'title' => $title,
            'message' => $message,
            'type' => 'order',
            'priority' => $priority,
            'order_id' => $orderId,
            'action_url' => "/admin/orders/{$orderId}"
        ]);
    }

    public static function createUserNotification($userId, $title, $message, $priority = 'medium')
    {
        return self::create([
            'title' => $title,
            'message' => $message,
            'type' => 'user',
            'priority' => $priority,
            'user_id' => $userId,
            'action_url' => "/admin/users/{$userId}"
        ]);
    }

    public static function createSystemNotification($title, $message, $type = 'info', $priority = 'medium')
    {
        return self::create([
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'priority' => $priority
        ]);
    }
}
