<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Coupon::query();

        // Search by code
        if ($request->has('code')) {
            $query->where('code', 'like', '%' . $request->input('code') . '%');
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Update status based on expiry date
        Coupon::where('expires_at', '<', Carbon::now())->update(['is_active' => false]);

        $coupons = $query->get()->map(function($coupon) {
            $coupon->is_active = $coupon->expires_at >= Carbon::now();
            return $coupon;
        });

        return response()->json(['data' => $coupons]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code|max:255',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'expires_at' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $coupon = Coupon::create($request->all());

        return response()->json(['message' => 'تم إنشاء الكوبون بنجاح.', 'data' => $coupon], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->is_active = $coupon->expires_at >= Carbon::now();
        return response()->json(['data' => $coupon]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code,' . $id . '|max:255',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'expires_at' => 'required|date',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $coupon->update($request->all());

        return response()->json(['message' => 'تم تحديث الكوبون بنجاح.', 'data' => $coupon]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json(['message' => 'تم حذف الكوبون بنجاح.']);
    }
}
