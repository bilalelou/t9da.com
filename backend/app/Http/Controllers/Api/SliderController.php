<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Exception;

class SliderController extends Controller
{
    /**
     * عرض جميع الشرائح
     */
    public function index()
    {
        try {
            $sliders = Slider::ordered()->get();
            return response()->json([
                'success' => true,
                'data' => $sliders
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب الشرائح'
            ], 500);
        }
    }

    /**
     * عرض الشرائح النشطة للمستخدمين (للصفحة الرئيسية)
     */
    public function active()
    {
        try {
            $sliders = Slider::active()->ordered()->get();
            return response()->json([
                'success' => true,
                'data' => $sliders
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب الشرائح'
            ], 500);
        }
    }

    /**
     * إنشاء شريحة جديدة
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string|max:500',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $slider = Slider::create([
                'title' => $request->title,
                'description' => $request->description,
                'image_url' => $request->image_url,
                'button_text' => $request->button_text,
                'button_link' => $request->button_link,
                'order' => $request->order ?? 0,
                'is_active' => $request->is_active ?? true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الشريحة بنجاح',
                'data' => $slider
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في إضافة الشريحة'
            ], 500);
        }
    }

    /**
     * عرض شريحة واحدة
     */
    public function show(Slider $slider)
    {
        return response()->json([
            'success' => true,
            'data' => $slider
        ]);
    }

    /**
     * تحديث شريحة
     */
    public function update(Request $request, Slider $slider)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string|max:500',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $slider->update([
                'title' => $request->title,
                'description' => $request->description,
                'image_url' => $request->image_url,
                'button_text' => $request->button_text,
                'button_link' => $request->button_link,
                'order' => $request->order ?? $slider->order,
                'is_active' => $request->is_active ?? $slider->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الشريحة بنجاح',
                'data' => $slider
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الشريحة'
            ], 500);
        }
    }

    /**
     * حذف شريحة
     */
    public function destroy(Slider $slider)
    {
        try {
            $slider->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشريحة بنجاح'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حذف الشريحة'
            ], 500);
        }
    }

    /**
     * تغيير حالة التفعيل
     */
    public function toggleActive(Slider $slider)
    {
        try {
            $slider->update([
                'is_active' => !$slider->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => $slider->is_active ? 'تم تفعيل الشريحة' : 'تم إلغاء تفعيل الشريحة',
                'data' => $slider
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تغيير حالة الشريحة'
            ], 500);
        }
    }

    /**
     * إعادة ترتيب الشرائح
     */
    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:sliders,id',
            'sliders.*.order' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->sliders as $sliderData) {
                Slider::where('id', $sliderData['id'])
                    ->update(['order' => $sliderData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث ترتيب الشرائح بنجاح'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الترتيب'
            ], 500);
        }
    }
}
