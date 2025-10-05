<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use App\Models\Color;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ColorController extends BaseApiController
{

    private const MESSAGE_FETCH_ERROR = 'حدث خطأ في جلب الألوان';
    private const MESSAGE_CREATE_SUCCESS = 'تم إضافة اللون بنجاح';
    private const MESSAGE_CREATE_ERROR = 'حدث خطأ في إضافة اللون';
    private const MESSAGE_UPDATE_SUCCESS = 'تم تحديث اللون بنجاح';
    private const MESSAGE_UPDATE_ERROR = 'حدث خطأ في تحديث اللون';
    private const MESSAGE_DELETE_SUCCESS = 'تم حذف اللون بنجاح';
    private const MESSAGE_DELETE_ERROR = 'حدث خطأ في حذف اللون';
    private const MESSAGE_DELETE_CONSTRAINT = 'لا يمكن حذف هذا اللون لأنه مرتبط بمنتجات';

    /**
     * Display a listing of active colors.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $colors = Color::active()->get();

            return $this->successResponse($colors);
        } catch (\Exception $e) {
            Log::error('Error fetching colors: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_FETCH_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Store a newly created color in storage.
     *
     * @param StoreColorRequest $request
     * @return JsonResponse
     */
    public function store(StoreColorRequest $request): JsonResponse
    {
        try {
            $color = Color::create($request->validated());

            return $this->successResponse(
                $color,
                self::MESSAGE_CREATE_SUCCESS,
                self::HTTP_CREATED
            );
        } catch (\Exception $e) {
            Log::error('Error creating color: ' . $e->getMessage(), [
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_CREATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Display the specified color.
     *
     * @param Color $color
     * @return JsonResponse
     */
    public function show(Color $color): JsonResponse
    {
        return $this->successResponse($color);
    }

    /**
     * Update the specified color in storage.
     *
     * @param UpdateColorRequest $request
     * @param Color $color
     * @return JsonResponse
     */
    public function update(UpdateColorRequest $request, Color $color): JsonResponse
    {
        try {
            $color->update($request->validated());

            return $this->successResponse($color, self::MESSAGE_UPDATE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error updating color: ' . $e->getMessage(), [
                'color_id' => $color->id,
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_UPDATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Remove the specified color from storage.
     *
     * @param Color $color
     * @return JsonResponse
     */
    public function destroy(Color $color): JsonResponse
    {
        try {
            if ($this->hasDependentProducts($color)) {
                return $this->errorResponse(
                    self::MESSAGE_DELETE_CONSTRAINT,
                    self::HTTP_BAD_REQUEST
                );
            }

            $color->delete();

            return $this->successResponse(null, self::MESSAGE_DELETE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error deleting color: ' . $e->getMessage(), [
                'color_id' => $color->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_DELETE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Check if color has dependent product variants.
     *
     * @param Color $color
     * @return bool
     */
    private function hasDependentProducts(Color $color): bool
    {
        return $color->productVariants()->count() > 0;
    }
}
