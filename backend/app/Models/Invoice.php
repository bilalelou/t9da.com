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
        'admin_notes'
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
}