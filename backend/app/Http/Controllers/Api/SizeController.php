<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSizeRequest;
use App\Http\Requests\UpdateSizeRequest;
use App\Models\Size;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SizeController extends BaseApiController
{

    private const MESSAGE_FETCH_ERROR = 'حدث خطأ في جلب الأحجام';
    private const MESSAGE_CREATE_SUCCESS = 'تم إضافة الحجم بنجاح';
    private const MESSAGE_CREATE_ERROR = 'حدث خطأ في إضافة الحجم';
    private const MESSAGE_UPDATE_SUCCESS = 'تم تحديث الحجم بنجاح';
    private const MESSAGE_UPDATE_ERROR = 'حدث خ��أ في تحديث الحجم';
    private const MESSAGE_DELETE_SUCCESS = 'تم حذف الحجم بنجاح';
    private const MESSAGE_DELETE_ERROR = 'حدث خطأ في حذف الحجم';
    private const MESSAGE_DELETE_CONSTRAINT = 'لا يمكن حذف هذا الحجم لأنه مرتبط بمنتجات';

    /**
     * Display a listing of active sizes ordered by sort_order.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $sizes = Size::active()->ordered()->get();

            return $this->successResponse($sizes);
        } catch (\Exception $e) {
            Log::error('Error fetching sizes: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_FETCH_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Store a newly created size in storage.
     *
     * @param StoreSizeRequest $request
     * @return JsonResponse
     */
    public function store(StoreSizeRequest $request): JsonResponse
    {
        try {
            $size = Size::create($request->validated());

            return $this->successResponse(
                $size,
                self::MESSAGE_CREATE_SUCCESS,
                self::HTTP_CREATED
            );
        } catch (\Exception $e) {
            Log::error('Error creating size: ' . $e->getMessage(), [
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_CREATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Display the specified size.
     *
     * @param Size $size
     * @return JsonResponse
     */
    public function show(Size $size): JsonResponse
    {
        return $this->successResponse($size);
    }

    /**
     * Update the specified size in storage.
     *
     * @param UpdateSizeRequest $request
     * @param Size $size
     * @return JsonResponse
     */
    public function update(UpdateSizeRequest $request, Size $size): JsonResponse
    {
        try {
            $size->update($request->validated());

            return $this->successResponse($size, self::MESSAGE_UPDATE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error updating size: ' . $e->getMessage(), [
                'size_id' => $size->id,
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_UPDATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Remove the specified size from storage.
     *
     * @param Size $size
     * @return JsonResponse
     */
    public function destroy(Size $size): JsonResponse
    {
        try {
            if ($this->hasDependentProducts($size)) {
                return $this->errorResponse(
                    self::MESSAGE_DELETE_CONSTRAINT,
                    self::HTTP_BAD_REQUEST
                );
            }

            $size->delete();

            return $this->successResponse(null, self::MESSAGE_DELETE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error deleting size: ' . $e->getMessage(), [
                'size_id' => $size->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_DELETE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Check if size has dependent product variants.
     *
     * @param Size $size
     * @return bool
     */
    private function hasDependentProducts(Size $size): bool
    {
        return $size->productVariants()->count() > 0;
    }
}
