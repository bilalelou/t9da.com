<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Base API Controller with common response methods.
 * All API controllers should extend this class.
 */
abstract class BaseApiController extends Controller
{
    // HTTP Status Codes
    protected const HTTP_OK = 200;
    protected const HTTP_CREATED = 201;
    protected const HTTP_NO_CONTENT = 204;
    protected const HTTP_BAD_REQUEST = 400;
    protected const HTTP_UNAUTHORIZED = 401;
    protected const HTTP_FORBIDDEN = 403;
    protected const HTTP_NOT_FOUND = 404;
    protected const HTTP_CONFLICT = 409;
    protected const HTTP_UNPROCESSABLE_ENTITY = 422;
    protected const HTTP_INTERNAL_ERROR = 500;

    /**
     * Return a success JSON response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse(
        $data = null,
        ?string $message = null,
        int $statusCode = self::HTTP_OK
    ): JsonResponse {
        $response = ['success' => true];

        if ($message !== null) {
            $response['message'] = $message;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return an error JSON response.
     *
     * @param string $message
     * @param int $statusCode
     * @param array|null $errors
     * @return JsonResponse
     */
    protected function errorResponse(
        string $message,
        int $statusCode = self::HTTP_INTERNAL_ERROR,
        ?array $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a validation error response.
     *
     * @param array $errors
     * @param string|null $message
     * @return JsonResponse
     */
    protected function validationErrorResponse(
        array $errors,
        ?string $message = 'خطأ في التحقق من البيانات'
    ): JsonResponse {
        return $this->errorResponse(
            $message,
            self::HTTP_UNPROCESSABLE_ENTITY,
            $errors
        );
    }

    /**
     * Return a not found error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(
        string $message = 'العنصر المطلوب غير موجود'
    ): JsonResponse {
        return $this->errorResponse($message, self::HTTP_NOT_FOUND);
    }

    /**
     * Return an unauthorized error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function unauthorizedResponse(
        string $message = 'غير مصرح'
    ): JsonResponse {
        return $this->errorResponse($message, self::HTTP_UNAUTHORIZED);
    }

    /**
     * Return a forbidden error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function forbiddenResponse(
        string $message = 'غير مصرح به'
    ): JsonResponse {
        return $this->errorResponse($message, self::HTTP_FORBIDDEN);
    }
}
