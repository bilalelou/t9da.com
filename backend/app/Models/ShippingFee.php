<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShippingFee extends Model
{
        use HasFactory;

    protected $fillable = [
        'region',
        'cost',
    ];
}
