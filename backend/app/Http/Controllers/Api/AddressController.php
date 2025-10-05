<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AddressController extends BaseApiController
{

    private const MESSAGE_UNAUTHORIZED = 'غير مصرح به';
    private const MESSAGE_FETCH_ERROR = 'حدث خطأ في جلب العناوين';
    private const MESSAGE_CREATE_SUCCESS = 'تم إضافة العنوان بنجاح';
    private const MESSAGE_CREATE_ERROR = 'حدث خطأ في إضافة العنوان';
    private const MESSAGE_UPDATE_SUCCESS = 'تم تحديث العنوان بنجاح';
    private const MESSAGE_UPDATE_ERROR = 'حدث خطأ في تحديث العن��ان';
    private const MESSAGE_DELETE_SUCCESS = 'تم حذف العنوان بنجاح';
    private const MESSAGE_DELETE_ERROR = 'حدث خطأ في حذف العنوان';

    /**
     * Display a listing of user's addresses.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $addresses = Auth::user()->addresses()->get();

            return $this->successResponse($addresses);
        } catch (\Exception $e) {
            Log::error('Error fetching addresses: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_FETCH_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Store a newly created address in storage.
     *
     * @param StoreAddressRequest $request
     * @return JsonResponse
     */
    public function store(StoreAddressRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            // If this is the default address, unset other default addresses
            if ($data['is_default'] ?? false) {
                $this->unsetDefaultAddresses();
            }

            $address = Auth::user()->addresses()->create($data);

            return $this->successResponse(
                $address,
                self::MESSAGE_CREATE_SUCCESS,
                self::HTTP_CREATED
            );
        } catch (\Exception $e) {
            Log::error('Error creating address: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_CREATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Update the specified address in storage.
     *
     * @param UpdateAddressRequest $request
     * @param Address $address
     * @return JsonResponse
     */
    public function update(UpdateAddressRequest $request, Address $address): JsonResponse
    {
        try {
            // Check if user owns this address
            if (!$this->userOwnsAddress($address)) {
                return $this->errorResponse(self::MESSAGE_UNAUTHORIZED, self::HTTP_FORBIDDEN);
            }

            $data = $request->validated();

            // If this is the default address, unset other default addresses
            if ($data['is_default'] ?? false) {
                $this->unsetDefaultAddresses($address->id);
            }

            $address->update($data);

            return $this->successResponse($address, self::MESSAGE_UPDATE_SUCCESS);
        } catch (\Exception $e) {
            Log::error('Error updating address: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'address_id' => $address->id,
                'request_data' => $request->validated(),
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_UPDATE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Remove the specified address from storage.
     *
     * @param Address $address
     * @return JsonResponse
     */
    public function destroy(Address $address): JsonResponse
    {
        try {
            // Check if user owns this address
            if (!$this->userOwnsAddress($address)) {
                return $this->errorResponse(self::MESSAGE_UNAUTHORIZED, self::HTTP_FORBIDDEN);
            }

            $address->delete();

            return $this->successResponse(null, self::MESSAGE_DELETE_SUCCESS, self::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            Log::error('Error deleting address: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'address_id' => $address->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse(self::MESSAGE_DELETE_ERROR, self::HTTP_INTERNAL_ERROR);
        }
    }

    /**
     * Check if the authenticated user owns the address.
     *
     * @param Address $address
     * @return bool
     */
    private function userOwnsAddress(Address $address): bool
    {
        return $address->user_id === Auth::id();
    }

    /**
     * Unset default flag for all user's addresses except the specified one.
     *
     * @param int|null $exceptId
     * @return void
     */
    private function unsetDefaultAddresses(?int $exceptId = null): void
    {
        $query = Auth::user()->addresses();

        if ($exceptId !== null) {
            $query->where('id', '!=', $exceptId);
        }

        $query->update(['is_default' => false]);
    }
}
