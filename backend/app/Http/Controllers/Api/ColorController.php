<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $colors = Color::active()->get();

            return response()->json([
                'success' => true,
                'data' => $colors
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الألوان'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'hex_code' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean'
        ]);

        try {
            $color = Color::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة اللون بنجاح',
                'data' => $color
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة اللون'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $color
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Color $color): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'hex_code' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean'
        ]);

        try {
            $color->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث اللون بنجاح',
                'data' => $color
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث اللون'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color): JsonResponse
    {
        try {
            // التحقق من وجود متغيرات مرتبطة بهذا اللون
            if ($color->productVariants()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف هذا اللون لأنه مرتبط بمنتجات'
                ], 400);
            }

            $color->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف اللون بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف اللون'
            ], 500);
        }
    }
}
