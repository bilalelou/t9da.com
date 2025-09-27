<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Http\Resources\CityResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CityController extends Controller
{
    /**
     * عرض جميع المدن
     */
    public function index(): JsonResponse
    {
        try {
            $cities = City::orderByName()->get();
            
            return response()->json([
                'success' => true,
                'data' => CityResource::collection($cities),
                'statistics' => [
                    'total_cities' => $cities->count(),
                    'active_cities' => $cities->where('is_active', true)->count(),
                    'average_price' => round($cities->where('is_active', true)->avg('price'), 2),
                    'min_price' => $cities->where('is_active', true)->min('price'),
                    'max_price' => $cities->where('is_active', true)->max('price'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب البيانات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء مدينة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:cities,name',
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string|max:100',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'اسم المدينة مطلوب',
                'name.unique' => 'هذه المدينة موجودة بالفعل',
                'price.required' => 'سعر التوصيل مطلوب',
                'price.numeric' => 'سعر التوصيل يجب أن يكون رقم',
                'price.min' => 'سعر التوصيل لا يمكن أن يكون سالب',
                'duration.required' => 'مدة التوصيل مطلوبة',
            ]);

            $city = City::create([
                'name' => $request->name,
                'price' => $request->price,
                'duration' => $request->duration,
                'is_active' => $request->is_active ?? true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة المدينة بنجاح',
                'data' => new CityResource($city)
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في إضافة المدينة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض مدينة محددة
     */
    public function show(City $city): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $city
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'المدينة غير موجودة',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * تحديث مدينة
     */
    public function update(Request $request, City $city): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:cities,name,' . $city->id,
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string|max:100',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'اسم المدينة مطلوب',
                'name.unique' => 'هذه المدينة موجودة بالفعل',
                'price.required' => 'سعر التوصيل مطلوب',
                'price.numeric' => 'سعر التوصيل يجب أن يكون رقم',
                'price.min' => 'سعر التوصيل لا يمكن أن يكون سالب',
                'duration.required' => 'مدة التوصيل مطلوبة',
            ]);

            $city->update([
                'name' => $request->name,
                'price' => $request->price,
                'duration' => $request->duration,
                'is_active' => $request->is_active ?? $city->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المدينة بنجاح',
                'data' => $city->fresh()
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث المدينة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مدينة
     */
    public function destroy(City $city): JsonResponse
    {
        try {
            $city->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المدينة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في حذف المدينة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على المدن النشطة فقط (للعرض العام)
     */
    public function active(): JsonResponse
    {
        try {
            $cities = City::active()->orderByName()->get();
            
            return response()->json([
                'success' => true,
                'data' => $cities
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب البيانات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تفعيل/إلغاء تفعيل مدينة
     */
    public function toggleStatus(City $city): JsonResponse
    {
        try {
            $city->update(['is_active' => !$city->is_active]);

            return response()->json([
                'success' => true,
                'message' => $city->is_active ? 'تم تفعيل المدينة' : 'تم إلغاء تفعيل المدينة',
                'data' => $city->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في تغيير حالة المدينة',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
