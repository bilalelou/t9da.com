<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BrandController extends BaseApiController
{

    private const STORAGE_PATH_NEW = 'uploads/brands/';
    private const STORAGE_PATH_OLD = 'logos/';
    private const PLACEHOLDER_URL = 'https://placehold.co/128x128/f0f0f0/cccccc?text=';

    private const MESSAGE_FETCH_ERROR = 'حدث خطأ في جلب الماركات';
    private const MESSAGE_CREATE_SUCCESS = 'تمت إضافة الماركة بنجاح';
    private const MESSAGE_CREATE_ERROR = 'حدث خطأ في إضافة الماركة';
    private const MESSAGE_UPDATE_SUCCESS = 'تم تحد��ث الماركة بنجاح';
    private const MESSAGE_UPDATE_ERROR = 'حدث خطأ في تحديث الماركة';
    private const MESSAGE_DELETE_SUCCESS = 'تم حذف الماركة بنجاح';
    private const MESSAGE_DELETE_ERROR = 'حدث خطأ في حذف الماركة';
    private const MESSAGE_DELETE_CONSTRAINT = 'لا يمكن حذف الماركة لأنها مرتبطة بمنتجات';

    /**
     * Display a listing of brands with product count.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $this->logAuthenticationInfo();

            $brands = Brand::withCount('products')
                ->latest()
                ->get()
                ->map(function ($brand) {
                    return $this->formatBrandWithLogo($brand);
                });

            Log::info('Brands fetched successfully', [
                'count' => $brands->count()
            ]);

            return $this->successResponse($brands);
        } catch (\Exception $e) {
            Log::error('Error fetching brands: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_FETCH_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Store a newly created brand in storage.
     *
     * @param StoreBrandRequest $request
     * @return JsonResponse
     */
    public function store(StoreBrandRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['name']);

            if ($request->hasFile('logo')) {
                $data['image'] = $this->uploadLogo($request->file('logo'));
            }

            $brand = Brand::create($data);

            Log::info('Brand created successfully', [
                'brand_id' => $brand->id,
                'brand_name' => $brand->name
            ]);

            return $this->successResponse(
                $brand,
                self::MESSAGE_CREATE_SUCCESS,
                self::HTTP_CREATED
            );
        } catch (\Exception $e) {
            Log::error('Error creating brand: ' . $e->getMessage(), [
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_CREATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Display the specified brand.
     *
     * @param Brand $brand
     * @return JsonResponse
     */
    public function show(Brand $brand): JsonResponse
    {
        try {
            $brand = $this->formatBrandWithLogo($brand);

            return $this->successResponse($brand);
        } catch (\Exception $e) {
            Log::error('Error showing brand: ' . $e->getMessage(), [
                'brand_id' => $brand->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_FETCH_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Update the specified brand in storage.
     *
     * @param UpdateBrandRequest $request
     * @param Brand $brand
     * @return JsonResponse
     */
    public function update(UpdateBrandRequest $request, Brand $brand): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($brand->image) {
                    $this->deleteLogo($brand->image);
                }

                $data['image'] = $this->uploadLogo($request->file('logo'));
            }

            $brand->update($data);

            Log::info('Brand updated successfully', [
                'brand_id' => $brand->id,
                'brand_name' => $brand->name
            ]);

            return $this->successResponse($brand, self::MESSAGE_UPDATE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error updating brand: ' . $e->getMessage(), [
                'brand_id' => $brand->id,
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_UPDATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Remove the specified brand from storage.
     *
     * @param Brand $brand
     * @return JsonResponse
     */
    public function destroy(Brand $brand): JsonResponse
    {
        try {
            if ($this->hasDependentProducts($brand)) {
                return $this->errorResponse(
                    self::MESSAGE_DELETE_CONSTRAINT,
                    self::HTTP_CONFLICT
                );
            }

            if ($brand->image) {
                $this->deleteLogo($brand->image);
            }

            $brand->delete();

            Log::info('Brand deleted successfully', [
                'brand_id' => $brand->id,
                'brand_name' => $brand->name
            ]);

            return $this->successResponse(null, self::MESSAGE_DELETE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error deleting brand: ' . $e->getMessage(), [
                'brand_id' => $brand->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_DELETE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Upload brand logo and return filename.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string
     */
    private function uploadLogo($file): string
    {
        $logoName = time() . '.' . $file->extension();
        $file->storeAs(self::STORAGE_PATH_NEW, $logoName, 'public');

        return $logoName;
    }

    /**
     * Delete brand logo from storage.
     *
     * @param string $filename
     * @return void
     */
    private function deleteLogo(string $filename): void
    {
        // Try deleting from both possible locations
        Storage::disk('public')->delete(self::STORAGE_PATH_NEW . $filename);
        Storage::disk('public')->delete(self::STORAGE_PATH_OLD . $filename);
    }

    /**
     * Format brand with logo URL.
     *
     * @param Brand $brand
     * @return Brand
     */
    private function formatBrandWithLogo(Brand $brand): Brand
    {
        if ($brand->image) {
            $brand->logo = $this->getLogoUrl($brand->image);
        } else {
            $brand->logo = $this->getPlaceholderUrl($brand->name);
        }

        return $brand;
    }

    /**
     * Get logo URL (prefers new path, falls back to old).
     *
     * @param string $filename
     * @return string
     */
    private function getLogoUrl(string $filename): string
    {
        $newPath = 'storage/' . self::STORAGE_PATH_NEW . $filename;
        $oldPath = 'storage/' . self::STORAGE_PATH_OLD . $filename;

        return asset(
            file_exists(public_path($newPath)) ? $newPath : $oldPath
        );
    }

    /**
     * Get placeholder URL for brand without logo.
     *
     * @param string $name
     * @return string
     */
    private function getPlaceholderUrl(string $name): string
    {
        $initial = $name[0] ?? 'B';
        return self::PLACEHOLDER_URL . $initial;
    }

    /**
     * Check if brand has dependent products.
     *
     * @param Brand $brand
     * @return bool
     */
    private function hasDependentProducts(Brand $brand): bool
    {
        return $brand->products()->count() > 0;
    }

    /**
     * Log authentication information for debugging.
     *
     * @return void
     */
    private function logAuthenticationInfo(): void
    {
        Log::info('Brand request authentication info', [
            'authenticated' => auth()->check(),
            'user_id' => auth()->id(),
            'has_token' => request()->bearerToken() !== null
        ]);
    }
}
