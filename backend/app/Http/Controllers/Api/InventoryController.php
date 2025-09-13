<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    /**
     * عرض قائمة بالمخزون.
     */
    public function index()
    {
        try {
            $inventoryItems = Product::select('id', 'name', 'SKU', 'quantity', 'stock_status', 'image')
                ->latest()
                ->get()
                ->map(function ($product) {
                    $product->image = $product->image ? asset('storage/uploads/' . $product->image) : 'https://placehold.co/100x100?text=No+Image';
                    return $product;
                });

            return response()->json(['success' => true, 'data' => $inventoryItems]);
        } catch (Exception $e) {
            Log::error('خطأ في جلب المخزون: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * تحديث كمية منتج واحد.
     */
    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'الكمية المدخلة غير صالحة.'], 422);
        }

        try {
            $newQuantity = $request->input('quantity');
            $product->quantity = $newQuantity;
            $product->stock_status = $newQuantity > 0 ? 'instock' : 'outofstock';
            $product->save();

            return response()->json(['success' => true, 'message' => 'تم تحديث الكمية بنجاح.']);
        } catch (Exception $e) {
            Log::error("خطأ في تحديث مخزون المنتج {$product->id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
}
