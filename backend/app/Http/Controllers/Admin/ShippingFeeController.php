<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShippingFee;

class ShippingFeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use paginate() to work with the pagination links in your view
        $shipping_fees = ShippingFee::paginate(10);
        return view('admin.shipping.index', compact('shipping_fees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.shipping.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'region' => 'required|string|max:255|unique:shipping_fees',
            'cost' => 'required|numeric|min:0',
        ]);

        ShippingFee::create($request->all());

        return redirect()->route('admin.shipping_fees.index')->with('success', 'Shipping fee added successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $fee = ShippingFee::findOrFail($id);
        return view('admin.shipping.edit', compact('fee'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $fee = ShippingFee::findOrFail($id);

        $request->validate([
            'region' => 'required|string|max:255|unique:shipping_fees,region,' . $fee->id,
            'cost' => 'required|numeric|min:0',
        ]);

        $fee->update($request->all());

        return redirect()->route('admin.shipping_fees.index')->with('success', 'Shipping fee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $fee = ShippingFee::findOrFail($id);
        $fee->delete();

        return redirect()->route('admin.shipping_fees.index')->with('success', 'Shipping fee deleted successfully.');
    }
}
