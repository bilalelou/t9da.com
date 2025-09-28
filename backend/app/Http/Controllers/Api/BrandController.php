<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class BrandController extends Controller
{
    public function index()
    {
        try {
            Log::info("🏷️ طلب جلب الماركات");
            Log::info("🔐 معلومات المصادقة:");
            Log::info("  - User authenticated: " . (auth()->check() ? 'نعم' : 'لا'));
            Log::info("  - User ID: " . (auth()->id() ?? 'غير موجود'));
            Log::info("  - Token: " . (request()->bearerToken() ? 'موجود' : 'غير موجود'));

            $brands = Brand::withCount('products')->latest()->get()->map(function($brand){
                // Backward compatibility: if file exists in old logos/ path use it, else use new uploads/brands
                if ($brand->image) {
                    $newPath = 'storage/uploads/brands/' . $brand->image;
                    $oldPath = 'storage/logos/' . $brand->image;
                    $brand->logo = asset(file_exists(public_path($newPath)) ? $newPath : $oldPath);
                } else {
                    $brand->logo = 'https://placehold.co/128x128/f0f0f0/cccccc?text=' . ($brand->name[0] ?? 'B');
                }
                return $brand;
            });

            Log::info("🏷️ عدد الماركات: " . $brands->count());
            Log::info("🏷️ الماركات: " . json_encode($brands));

            return response()->json(['data' => $brands]);
        } catch (Exception $e) {
            Log::error('❌ خطأ في جلب الماركات: ' . $e->getMessage());
            Log::error('❌ Stack trace: ' . $e->getTraceAsString());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation errors', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('logo')) {
            $logoName = time() . '.' . $request->logo->extension();
            // استخدم قرص public صراحةً حتى لو كانت قيمة FILESYSTEM_DISK ليست public
            $request->logo->storeAs('uploads/brands', $logoName, 'public');
            $data['image'] = $logoName;
        }

        Brand::create($data);
        return response()->json(['message' => 'تمت إضافة الماركة بنجاح!'], 201);
    }

    public function show(Brand $brand)
    {
        // Add logo URL (prefers new path, falls back to old)
        if ($brand->image) {
            $newPath = 'storage/uploads/brands/' . $brand->image;
            $oldPath = 'storage/logos/' . $brand->image;
            $brand->logo = asset(file_exists(public_path($newPath)) ? $newPath : $oldPath);
        } else {
            $brand->logo = null;
        }

        return response()->json(['data' => $brand]);
    }

    public function update(Request $request, Brand $brand)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation errors', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('logo')) {
            if ($brand->image) {
                // Try deleting from both possible locations
                Storage::disk('public')->delete('uploads/brands/' . $brand->image);
                Storage::disk('public')->delete('logos/' . $brand->image);
            }
            $logoName = time() . '.' . $request->logo->extension();
            $request->logo->storeAs('uploads/brands', $logoName, 'public');
            $data['image'] = $logoName;
        }

        $brand->update($data);
        return response()->json(['message' => 'تم تحديث الماركة بنجاح!']);
    }

    public function destroy(Brand $brand)
    {
        if ($brand->products()->count() > 0) {
            return response()->json(['message' => 'لا يمكن حذف الماركة لأنها مرتبطة بمنتجات.'], 409);
        }

        if ($brand->image) {
            Storage::disk('public')->delete('uploads/brands/' . $brand->image);
            Storage::disk('public')->delete('logos/' . $brand->image); // old path
        }
        $brand->delete();
        return response()->json(['message' => 'تم حذف الماركة بنجاح.']);
    }
}
