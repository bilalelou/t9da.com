<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator; // [إضافة]
use Illuminate\Support\Str; // [إضافة]
use Exception;

class ProductController extends Controller
{
    /**
     * عرض جميع المنتجات (لصفحة المنتجات الكاملة مستقبلاً)
     */
    public function index()
    {
        try {
            $products = Product::with('category')->latest()->paginate(15);

            $formattedProducts = $products->getCollection()->transform(function ($product) {

                $status = $product->status ?? 'draft'; // القيمة الافتراضية
                if ($product->stock_status === 'outofstock' || $product->quantity <= 0) {
                    $status = 'out_of_stock';
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image ? asset('storage/' . $product->image) : 'https://placehold.co/100x100/f0f0f0/cccccc?text=No+Image',
                    'category' => $product->category->name ?? 'غير مصنف',
                    'price' => $product->sale_price ?? $product->regular_price,
                    'originalPrice' => $product->sale_price ? $product->regular_price : null,
                    'stock' => $product->quantity ?? 0,
                    'status' => $status,
                    'sold' => rand(10, 200),
                    'rating' => rand(30, 50) / 10,
                    'reviews' => rand(5, 150),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedProducts,
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب المنتجات: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الخادم أثناء جلب بيانات المنتجات.',
            ], 500);
        }
    }

    /**
     * [إضافة] دالة جديدة لتخزين منتج جديد.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lte:regular_price',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20048',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            $data['slug'] = Str::slug($data['name']);

            // [إضافة] توليد SKU فريد تلقائياً
            // يأخذ أول 3 أحرف من الاسم ويضيف إليها رقماً فريداً
            $data['SKU'] = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['name']), 0, 3)) . '-' . uniqid();


            if ($request->hasFile('image')) {
                $imageName = time() . '_main.' . $request->image->extension();
                $request->image->storeAs('uploads', $imageName, 'public');
                $data['image'] = $imageName;
            }

            if ($request->hasFile('images')) {
                $galleryImageNames = [];
                foreach ($request->file('images') as $file) {
                    $galleryImageName = time() . '_' . uniqid() . '.' . $file->extension();
                    $file->storeAs('uploads', $galleryImageName, 'public');
                    $galleryImageNames[] = $galleryImageName;
                }
                $data['images'] = json_encode($galleryImageNames);
            }

            $data['stock_status'] = $data['quantity'] > 0 ? 'instock' : 'outofstock';

            Product::create($data);

            return response()->json([
                'success' => true,
                'message' => 'تمت إضافة المنتج بنجاح!'
            ], 201);

        } catch (Exception $e) {
            Log::error('خطأ في إضافة المنتج: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الخادم أثناء إضافة المنتج.'
            ], 500);
        }
    }
    /**
     * عرض منتج واحد محدد
     */
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    /**
     * عرض قائمة بالمنتجات المميزة (الأكثر طلباً)
     */
    public function featured()
    {
        $products = Product::latest()->take(3)->get();
        return ProductResource::collection($products);
    }
}

