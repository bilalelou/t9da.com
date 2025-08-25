<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShippingFee;

class ShippingFeeController extends Controller
{
    public function index()
    {
        $shipping_fees = ShippingFee::all();
        return view('admin.shipping.index', compact('shipping_fees'));
    }

}
