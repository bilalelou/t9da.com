<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * عرض جميع التصنيفات.
     */
    public function index()
    {
        try {
            // جلب التصنيفات مع حساب عدد المنتجات المرتبطة بكل تصنيف
            $categories = Category::withCount('products')->latest()->get()->map(function($category) {
                // إضافة مسار الصورة الكامل
                $category->image = $category->image ? asset('storage/uploads/categories/' . $category->image) : null;
                return $category;
            });
            return response()->json(['success' => true, 'data' => $categories]);
        } catch (Exception $e) {
            Log::error('خطأ في جلب التصنيفات: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * تخزين تصنيف جديد.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            // [تحسين] إرسال أول خطأ تحقق كرسالة رئيسية لتكون أكثر وضوحاً
            $firstError = $validator->errors()->first();
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق: ' . $firstError,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['slug'] = Str::slug($data['name']);

            if ($request->hasFile('image')) {
                $imageName = time() . '.' . $request->image->extension();
                $request->image->storeAs('uploads/categories', $imageName, 'public');
                $data['image'] = $imageName;
            }

            Category::create($data);
            return response()->json(['success' => true, 'message' => 'تمت إضافة التصنيف بنجاح!'], 201);
        } catch (Exception $e) {
            Log::error('خطأ في إضافة التصنيف: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * عرض تصنيف واحد.
     */
    public function show(Category $category)
    {
        return response()->json(['success' => true, 'data' => [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'status' => $category->status,
            'image' => $category->image ? asset('storage/uploads/categories/' . $category->image) : null,
        ]]);
    }

    /**
     * تحديث تصنيف موجود.
     */
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            // [تحسين] إرسال أول خطأ تحقق كرسالة رئيسية لتكون أكثر وضوحاً
            $firstError = $validator->errors()->first();
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق: ' . $firstError,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            if ($request->hasFile('image')) {
                if ($category->image) {
                    Storage::disk('public')->delete('uploads/categories/' . $category->image);
                }
                $imageName = time() . '.' . $request->image->extension();
                $request->image->storeAs('uploads/categories', $imageName, 'public');
                $data['image'] = $imageName;
            }

            $category->update($data);
            return response()->json(['success' => true, 'message' => 'تم تحديث التصنيف بنجاح!']);
        } catch (Exception $e) {
            Log::error('خطأ في تحديث التصنيف: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * حذف تصنيف.
     */
    public function destroy(Category $category)
    {
        try {
            if ($category->products()->count() > 0) {
                return response()->json(['success' => false, 'message' => 'لا يمكن حذف هذا التصنيف لأنه يحتوي على منتجات مرتبطة به.'], 409);
            }

            if ($category->image) {
                Storage::disk('public')->delete('uploads/categories/' . $category->image);
            }
            $category->delete();
            return response()->json(['success' => true, 'message' => 'تم حذف التصنيف بنجاح.']);
        } catch (Exception $e) {
            Log::error('خطأ في حذف التصنيف: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
}

