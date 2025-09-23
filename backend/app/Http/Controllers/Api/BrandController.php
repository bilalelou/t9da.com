<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withCount('products')->latest()->get()->map(function($brand){
            $brand->logo = $brand->image ? asset('storage/logos/' . $brand->image) : 'https://placehold.co/128x128/f0f0f0/cccccc?text=' . $brand->name[0];
            return $brand;
        });
        return response()->json(['data' => $brands]);
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
            $request->logo->storeAs('public/logos', $logoName);
            $data['image'] = $logoName;
        }

        Brand::create($data);
        return response()->json(['message' => 'تمت إضافة الماركة بنجاح!'], 201);
    }

    public function show(Brand $brand)
    {
        // Add logo URL if exists
        $brand->logo = $brand->image ? asset('storage/logos/' . $brand->image) : null;

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
                Storage::disk('public')->delete('logos/' . $brand->image);
            }
            $logoName = time() . '.' . $request->logo->extension();
            $request->logo->storeAs('public/logos', $logoName);
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
            Storage::disk('public')->delete('logos/' . $brand->image);
        }
        $brand->delete();
        return response()->json(['message' => 'تم حذف الماركة بنجاح.']);
    }
}
