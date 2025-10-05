<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_code',
        'order_id',
        'amount',
        'bank_name',
        'account_number',
        'payment_proof',
        'status',
        'admin_notes',
        'payment_reference' // رمز الدفع
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public static function generateInvoiceCode()
    {
        do {
            $code = 'INV-' . strtoupper(uniqid());
        } while (self::where('invoice_code', $code)->exists());
        
        return $code;
    }

    public static function generatePaymentReference()
    {
        // توليد رمز دفع فريد من 7 أحرف وأرقام
        do {
            $code = strtolower(substr(md5(uniqid(mt_rand(), true)), 0, 7));
        } while (self::where('payment_reference', $code)->exists());
        
        return $code;
    }
}