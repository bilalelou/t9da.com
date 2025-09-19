<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductVariantController extends Controller
{
    /**
     * Get variants for a specific product
     */
    public function getProductVariants(Product $product)
    {
        try {
            $variants = $product->variants()->with(['color', 'size'])->get();

            return response()->json([
                'success' => true,
                'data' => $variants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب variants المنتج',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource for a specific product.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $productId = $request->get('product_id');

            $query = ProductVariant::with(['color', 'size', 'product']);

            if ($productId) {
                $query->where('product_id', $productId);
            }

            $variants = $query->active()->get();

            return response()->json([
                'success' => true,
                'data' => $variants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب متغيرات المنتج'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'color_id' => 'nullable|exists:colors,id',
            'size_id' => 'nullable|exists:sizes,id',
            'sku' => 'required|string|unique:product_variants,sku',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        try {
            // التحقق من عدم وجود نفس التركيبة
            $existingVariant = ProductVariant::where('product_id', $request->product_id)
                ->where('color_id', $request->color_id)
                ->where('size_id', $request->size_id)
                ->first();

            if ($existingVariant) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذه التركيبة من اللون والحجم موجودة بالفعل'
                ], 400);
            }

            $variant = ProductVariant::create($request->all());
            $variant->load(['color', 'size', 'product']);

            // تحديث حالة المنتج ليصبح له متغيرات
            $product = Product::find($request->product_id);
            if (!$product->has_variants) {
                $product->update(['has_variants' => true]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة المتغير بنجاح',
                'data' => $variant
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة المتغير'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $productVariant): JsonResponse
    {
        $productVariant->load(['color', 'size', 'product']);

        return response()->json([
            'success' => true,
            'data' => $productVariant
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductVariant $productVariant): JsonResponse
    {
        $request->validate([
            'color_id' => 'nullable|exists:colors,id',
            'size_id' => 'nullable|exists:sizes,id',
            'sku' => 'required|string|unique:product_variants,sku,' . $productVariant->id,
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        try {
            // التحقق من عدم وجود نفس التركيبة (باستثناء الحالي)
            $existingVariant = ProductVariant::where('product_id', $productVariant->product_id)
                ->where('color_id', $request->color_id)
                ->where('size_id', $request->size_id)
                ->where('id', '!=', $productVariant->id)
                ->first();

            if ($existingVariant) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذه التركيبة من اللون والحجم موجودة بالفعل'
                ], 400);
            }

            $productVariant->update($request->all());
            $productVariant->load(['color', 'size', 'product']);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المتغير بنجاح',
                'data' => $productVariant
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث المتغير'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductVariant $productVariant): JsonResponse
    {
        try {
            $productId = $productVariant->product_id;
            $productVariant->delete();

            // التحقق من وجود متغيرات أخرى للمنتج
            $remainingVariants = ProductVariant::where('product_id', $productId)->count();
            if ($remainingVariants === 0) {
                Product::find($productId)->update(['has_variants' => false]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المتغير بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف المتغير'
            ], 500);
        }
    }

    /**
     * Store multiple variants for a product.
     */
    public function storeBulk(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variants' => 'required|array|min:1',
            'variants.*.color_id' => 'nullable|exists:colors,id',
            'variants.*.size_id' => 'nullable|exists:sizes,id',
            'variants.*.sku' => 'required|string',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.compare_price' => 'nullable|numeric|min:0',
            'variants.*.quantity' => 'required|integer|min:0',
            'variants.*.image' => 'nullable|string',
            'variants.*.is_active' => 'boolean'
        ]);

        try {
            $createdVariants = [];

            foreach ($request->variants as $variantData) {
                $variantData['product_id'] = $request->product_id;

                // التحقق من عدم وجود نفس التركيبة
                $existingVariant = ProductVariant::where('product_id', $request->product_id)
                    ->where('color_id', $variantData['color_id'] ?? null)
                    ->where('size_id', $variantData['size_id'] ?? null)
                    ->first();

                if ($existingVariant) {
                    continue; // تخطي هذا المتغير إذا كان موجوداً
                }

                $variant = ProductVariant::create($variantData);
                $variant->load(['color', 'size']);
                $createdVariants[] = $variant;
            }

            // تحديث حالة المنتج ليصبح له متغيرات
            Product::find($request->product_id)->update(['has_variants' => true]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة المتغيرات بنجاح',
                'data' => $createdVariants
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة المتغيرات'
            ], 500);
        }
    }
}
