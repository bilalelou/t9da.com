<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $sizes = Size::active()->ordered()->get();

            return response()->json([
                'success' => true,
                'data' => $sizes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الأحجام'
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
            'display_name' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            $size = Size::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الحجم بنجاح',
                'data' => $size
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة الحجم'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Size $size): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $size
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Size $size): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            $size->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الحجم بنجاح',
                'data' => $size
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الحجم'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Size $size): JsonResponse
    {
        try {
            // التحقق من وجود متغيرات مرتبطة بهذا الحجم
            if ($size->productVariants()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف هذا الحجم لأنه مرتبط بمنتجات'
                ], 400);
            }

            $size->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الحجم بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الحجم'
            ], 500);
        }
    }
}
