<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Exception;

class ProductController extends Controller
{
    /**
     * عرض قائمة المنتجات.
     */
    public function index()
    {
        try {
            $products = Product::with('category')->latest()->paginate(15);
            $formattedProducts = $products->getCollection()->transform(fn($product) => $this->formatProduct($product));

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
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * تخزين منتج جديد.
     */
    public function store(Request $request)
    {
        $validator = $this->getProductValidator($request);

        if ($validator->fails()) {
            // [تحسين] إرسال أول خطأ تحقق كرسالة رئيسية لتكون أكثر وضوحاً
            $firstError = $validator->errors()->first();
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق: ' . $firstError,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['slug'] = Str::slug($data['name']);
            $data['SKU'] = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['name']), 0, 3)) . '-' . uniqid();

            // تسجيل معلومات عن الملفات المرسلة
            Log::info('Product creation request files:', [
                'has_image' => $request->hasFile('image'),
                'has_images' => $request->hasFile('images'),
                'image_info' => $request->hasFile('image') ? [
                    'name' => $request->file('image')->getClientOriginalName(),
                    'size' => $request->file('image')->getSize()
                ] : null
            ]);

            // معالجة الصورة الرئيسية
            if ($request->hasFile('image')) {
                $data['thumbnail'] = $this->storeImage($request->file('image'));
                Log::info('تم حفظ الصورة الرئيسية: ' . $data['thumbnail']);
            } else {
                Log::warning('لم يتم إرسال صورة رئيسية مع الطلب');
            }

            // معالجة صور المعرض
            if ($request->hasFile('images')) {
                $data['images'] = json_encode($this->storeGallery($request->file('images')));
                Log::info('تم حفظ صور المعرض: ' . $data['images']);
            }

            $data['stock_status'] = ($data['quantity'] ?? 0) > 0 ? 'instock' : 'outofstock';

            $product = Product::create($data);

            // Handle videos
            $this->handleProductVideos($request, $product);

            return response()->json([
                'success' => true,
                'message' => 'تمت إضافة المنتج بنجاح!',
                'data' => ['id' => $product->id]
            ], 201);
        } catch (Exception $e) {
            Log::error('خطأ في إضافة المنتج: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * عرض بيانات منتج واحد للتعديل.
     */
    public function show(Product $product)
    {
        try {
            return response()->json(['success' => true, 'data' => $this->formatProductForEdit($product)]);
        } catch (Exception $e) {
            Log::error("خطأ في عرض المنتج ID {$product->id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'لم يتم العثور على المنتج.'], 404);
        }
    }

    /**
     * تحديث منتج موجود.
     */
    public function update(Request $request, Product $product)
    {
        $validator = $this->getProductValidator($request, true); // true for update

        if ($validator->fails()) {
            // [تحسين] إرسال أول خطأ تحقق كرسالة رئيسية لتكون أكثر وضوحاً
            $firstError = $validator->errors()->first();
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق: ' . $firstError,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // معالجة الصورة الرئيسية في التحديث
            if ($request->hasFile('image')) {
                if ($product->thumbnail) Storage::disk('public')->delete('uploads/' . $product->thumbnail);
                $data['thumbnail'] = $this->storeImage($request->file('image'));
            }

            $currentGallery = json_decode($product->images, true) ?? [];
            $existingImagesSent = json_decode($request->input('existing_images', '[]'), true);

            $imagesToDelete = array_diff($currentGallery, array_map(fn($url) => basename($url), $existingImagesSent));
            foreach ($imagesToDelete as $imageFile) {
                Storage::disk('public')->delete('uploads/' . $imageFile);
            }

            $finalGallery = array_map(fn($url) => basename($url), $existingImagesSent);

            if ($request->hasFile('new_images')) {
                $newImageNames = $this->storeGallery($request->file('new_images'));
                $finalGallery = array_merge($finalGallery, $newImageNames);
            }

            $data['images'] = json_encode(array_values($finalGallery));
            $data['stock_status'] = ($data['quantity'] ?? $product->quantity) > 0 ? 'instock' : 'outofstock';

            $product->update($data);

            return response()->json(['success' => true, 'message' => 'تم تحديث المنتج بنجاح!']);
        } catch (Exception $e) {
            Log::error("خطأ في تحديث المنتج ID {$product->id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    // --- Helper Methods ---

    private function getProductValidator(Request $request, bool $isUpdate = false)
    {
        if ($isUpdate) {
            // [تعديل] قواعد التحقق الخاصة بالتحديث أكثر مرونة
            // 'sometimes' تعني: قم بالتحقق فقط إذا كان الحقل موجوداً في الطلب
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'description' => 'nullable|string',
                'regular_price' => 'sometimes|required|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0|lte:regular_price',
                'quantity' => 'sometimes|required|integer|min:0',
                'category_id' => 'sometimes|required|exists:categories,id',
                'brand_id' => 'nullable|exists:brands,id', // العلامة التجارية اختيارية
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB للصورة الرئيسية
                'new_images' => 'nullable|array',
                'new_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
                'existing_images' => 'nullable|json',
                'has_free_shipping' => 'boolean',
                'free_shipping_note' => 'nullable|string|max:500',
            ];
        } else {
            // قواعد التحقق الخاصة بإنشاء منتج جديد (أكثر صرامة)
            $rules = [
                'name' => 'required|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'description' => 'nullable|string',
                'regular_price' => 'required|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0|lte:regular_price',
                'quantity' => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,id',
                'brand_id' => 'nullable|exists:brands,id', // العلامة التجارية اختيارية
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB للصورة الرئيسية
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
                'has_free_shipping' => 'boolean',
                'free_shipping_note' => 'nullable|string|max:500',
            ];
        }

        return Validator::make($request->all(), $rules);
    }

    private function storeImage($file)
    {
        $name = time() . '_' . uniqid() . '.' . $file->extension();
        $file->storeAs('uploads', $name, 'public');
        return $name;
    }

    private function storeGallery(array $files)
    {
        $names = [];
        foreach ($files as $file) {
            $names[] = $this->storeImage($file);
        }
        return $names;
    }

    private function formatProduct(Product $product)
    {
        $status = $product->status ?? 'draft';
        if ($product->stock_status === 'outofstock' || $product->quantity <= 0) {
            $status = 'out_of_stock';
        }
        return [
            'id' => $product->id, 'name' => $product->name,
            'thumbnail' => $product->thumbnail ? asset('storage/uploads/' . $product->thumbnail) : 'https://placehold.co/100x100?text=No+Image',
            'category' => $product->category->name ?? 'غير مصنف',
            'price' => $product->sale_price ?? $product->regular_price,
            'originalPrice' => $product->sale_price ? $product->regular_price : null,
            'stock' => $product->quantity ?? 0, 'status' => $status,
            'sold' => 0, 'rating' => 0, 'reviews' => 0, // Placeholder data
        ];
    }

    private function formatProductForEdit(Product $product)
    {
        $gallery = json_decode($product->images, true) ?? [];
        $data = [
            'id' => $product->id, 'name' => $product->name,
            'short_description' => $product->short_description,
            'description' => $product->description,
            'regular_price' => $product->regular_price,
            'sale_price' => $product->sale_price,
            'quantity' => $product->quantity,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id, // إضافة العلامة التجارية
            'has_variants' => (bool)$product->has_variants,
            'thumbnail' => $product->thumbnail ? asset('storage/uploads/' . $product->thumbnail) : null,
            'images' => array_map(fn($img) => asset('storage/uploads/' . $img), $gallery),
        ];

        // إضافة الـ variants إذا كان المنتج يحتوي عليها
        if ($product->has_variants) {
            $variants = $product->variants()->with(['color', 'size'])->get();
            $data['variants'] = $variants->map(function($variant) {
                return [
                    'id' => $variant->id,
                    'color_id' => $variant->color_id,
                    'size_id' => $variant->size_id,
                    'sku' => $variant->sku,
                    'price' => (float)$variant->price,
                    'compare_price' => $variant->compare_price ? (float)$variant->compare_price : null,
                    'quantity' => (int)$variant->quantity,
                    'image' => $variant->image ? asset('storage/uploads/' . $variant->image) : null,
                    'is_active' => (bool)$variant->is_active,
                    'color' => $variant->color ? [
                        'id' => $variant->color->id,
                        'name' => $variant->color->name,
                        'hex_code' => $variant->color->hex_code,
                        'is_active' => $variant->color->is_active,
                    ] : null,
                    'size' => $variant->size ? [
                        'id' => $variant->size->id,
                        'name' => $variant->size->name,
                        'display_name' => $variant->size->display_name,
                        'sort_order' => $variant->size->sort_order,
                        'is_active' => $variant->size->is_active,
                    ] : null,
                ];
            });
        } else {
            $data['variants'] = [];
        }

        // إضافة الفيديوهات
        $videos = $product->videos()->orderBy('sort_order')->get();
        $data['videos'] = $videos->map(function($video) {
            return [
                'id' => $video->id,
                'video_url' => $video->video_url,
                'title' => $video->title,
                'description' => $video->description,
                'sort_order' => $video->sort_order,
                'is_featured' => (bool)$video->is_featured,
            ];
        });

        return $data;
    }

    /**
     * Handle product videos creation
     */
    private function handleProductVideos(Request $request, Product $product)
    {
        $sortOrder = 0;

        // Handle primary video
        if ($this->hasVideoData($request, 'primary')) {
            $this->createProductVideo($request, $product, 'primary', $sortOrder++, true);
        }

        // Handle secondary video
        if ($this->hasVideoData($request, 'secondary')) {
            $this->createProductVideo($request, $product, 'secondary', $sortOrder++, false);
        }
    }

    /**
     * Check if video data exists
     */
    private function hasVideoData(Request $request, string $type): bool
    {
        return $request->filled("{$type}_video_url") ||
               $request->hasFile("{$type}_video_file");
    }

    /**
     * Create a product video
     */
    private function createProductVideo(Request $request, Product $product, string $type, int $sortOrder, bool $isFeatured)
    {
        $videoType = $request->input("{$type}_video_type", 'youtube');
        $title = $request->input("{$type}_video_title", '');
        $videoUrl = '';

        if ($videoType === 'file' && $request->hasFile("{$type}_video_file")) {
            // Handle file upload
            $file = $request->file("{$type}_video_file");
            $fileName = 'videos/' . Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public', $fileName);
            $videoUrl = $fileName;
        } else {
            // Handle URL
            $videoUrl = $request->input("{$type}_video_url", '');
        }

        if (!empty($videoUrl)) {
            ProductVideo::create([
                'product_id' => $product->id,
                'title' => $title ?: ($isFeatured ? 'الفيديو الرئيسي' : 'فيديو ثانوي'),
                'video_type' => $videoType,
                'video_url' => $videoUrl,
                'sort_order' => $sortOrder,
                'is_featured' => $isFeatured,
                'is_active' => true,
            ]);
        }
    }

    /**
     * جلب المنتجات التي لها شحن مجاني
     */
    public function freeShippingProducts(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 12);
            $products = Product::freeShipping()
                ->with(['category', 'brand'])
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $products->items(),
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ],
                'message' => 'المنتجات مع الشحن المجاني'
            ]);
        } catch (Exception $e) {
            Log::error('خطأ في جلب منتجات الشحن المجاني: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * تفعيل/إلغاء تفعيل الشحن المجاني للمنتج
     */
    public function toggleFreeShipping(Request $request, Product $product)
    {
        try {
            $validator = Validator::make($request->all(), [
                'has_free_shipping' => 'required|boolean',
                'free_shipping_note' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صحيحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product->update([
                'has_free_shipping' => $request->has_free_shipping,
                'free_shipping_note' => $request->free_shipping_note,
            ]);

            $message = $product->has_free_shipping ?
                'تم تفعيل الشحن المجاني للمنتج' :
                'تم إلغاء الشحن المجاني للمنتج';

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'has_free_shipping' => $product->has_free_shipping,
                    'free_shipping_note' => $product->free_shipping_note,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('خطأ في تغيير حالة الشحن المجاني: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الخادم.'
            ], 500);
        }
    }
}

