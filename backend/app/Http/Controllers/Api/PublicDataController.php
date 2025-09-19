<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

use Exception;
use Illuminate\Support\Facades\Log;

class PublicDataController extends Controller
{
    /**
     * جلب كل البيانات اللازمة للصفحة الرئيسية في طلب واحد.
     */
    public function home()
    {
        try {
            // 1. الشرائح (Slides) - بيانات وهمية حالياً
            $slides = [
                ['id' => 1, 'title' => 'اكتشف أحدث التشكيلات', 'subtitle' => 'تصاميم عصرية تلبي كل الأذواق', 'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', 'link' => '/products'],
                ['id' => 2, 'title' => 'عروض خاصة لفترة محدودة', 'subtitle' => 'خصومات تصل إلى 50%', 'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', 'link' => '/offers'],
            ];

            // 2. المنتجات المميزة (أحدث 4 منتجات)
            $featuredProducts = Product::latest()->take(4)->get()->map(fn($p) => $this->formatProduct($p));

            // 3. التصنيفات (أحدث 3 تصنيفات)
            $categories = Category::latest()->take(3)->get()->map(function($c) {
                $c->image = $c->image ? asset('storage/uploads/categories/' . $c->image) : 'https://placehold.co/600x400?text=' . urlencode($c->name);
                return $c;
            });

            return response()->json([
                'slides' => $slides,
                'featuredProducts' => $featuredProducts,
                'categories' => $categories,
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب بيانات الصفحة الرئيسية: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
    public function shop(Request $request)
    {
        try {
            // جلب كل التصنيفات والماركات والألوان والأحجام لعرضها في الفلتر
            $categories = Category::all(['id', 'name', 'slug']);
            $brands = Brand::all(['id', 'name', 'slug']);
            $colors = \App\Models\Color::where('is_active', true)->get(['id', 'name', 'hex_code']);
            $sizes = \App\Models\Size::where('is_active', true)->get(['id', 'name', 'display_name']);

            // بناء استعلام المنتجات
            $query = Product::query()->with('category', 'brand');

            // الفلترة حسب التصنيفات
            if ($request->has('categories') && !empty($request->input('categories'))) {
                $categorySlugs = explode(',', $request->input('categories'));
                $query->whereHas('category', function ($q) use ($categorySlugs) {
                    $q->whereIn('slug', $categorySlugs);
                });
            }

            // الفلترة حسب الماركات
            if ($request->has('brands') && !empty($request->input('brands'))) {
                $brandSlugs = explode(',', $request->input('brands'));
                $query->whereHas('brand', function ($q) use ($brandSlugs) {
                    $q->whereIn('slug', $brandSlugs);
                });
            }

            // الفلترة حسب اللون
            if ($request->has('color') && !empty($request->input('color'))) {
                $colorName = $request->input('color');
                $query->whereHas('variants.color', function ($q) use ($colorName) {
                    $q->where('name', $colorName);
                });
            }

            // الفلترة حسب الحجم
            if ($request->has('size') && !empty($request->input('size'))) {
                $sizeName = $request->input('size');
                $query->whereHas('variants.size', function ($q) use ($sizeName) {
                    $q->where('name', $sizeName);
                });
            }

            // الفلترة حسب السعر
            if ($request->has('max_price')) {
                $query->where('regular_price', '<=', $request->input('max_price'));
            }

            // الترتيب
            switch ($request->input('sort')) {
                case 'price-asc':
                    $query->orderBy('regular_price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('regular_price', 'desc');
                    break;
                default:
                    $query->latest(); // الترتيب الافتراضي (الأحدث)
                    break;
            }

            // تنفيذ الاستعلام مع نظام الصفحات
            $products = $query->paginate(9);

            $formattedProducts = $products->getCollection()->transform(fn($p) => $this->formatProduct($p));

            return response()->json([
                'products' => $formattedProducts,
                'categories' => $categories,
                'brands' => $brands,
                'colors' => $colors,
                'sizes' => $sizes,
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب بيانات المتجر: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    public function show($slug)
    {
        try {
            $product = Product::where('slug', $slug)
                ->with(['category', 'variants.color', 'variants.size'])
                ->firstOrFail();

            // جلب المنتجات ذات الصلة (من نفس التصنيف)
            $relatedProducts = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id) // استثناء المنتج الحالي
                ->latest()
                ->take(4)
                ->get()
                ->map(fn($p) => $this->formatProduct($p));

            // تنسيق بيانات المنتج مع المتغيرات
            $formattedProduct = $this->formatProduct($product, true);

            // إضافة معلومات المتغيرات
            $formattedProduct['variants'] = $product->variants->map(function($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'price' => $variant->price,
                    'quantity' => $variant->quantity,
                    'color' => $variant->color ? [
                        'id' => $variant->color->id,
                        'name' => $variant->color->name,
                        'hex_code' => $variant->color->hex_code
                    ] : null,
                    'size' => $variant->size ? [
                        'id' => $variant->size->id,
                        'name' => $variant->size->name,
                        'display_name' => $variant->size->display_name
                    ] : null,
                ];
            });

            // استخراج الألوان والأحجام المتاحة
            $availableColors = $product->variants->whereNotNull('color')->pluck('color')->unique('id')->values();
            $availableSizes = $product->variants->whereNotNull('size')->pluck('size')->unique('id')->values();

            $formattedProduct['available_colors'] = $availableColors->map(function($color) {
                return [
                    'id' => $color->id,
                    'name' => $color->name,
                    'hex_code' => $color->hex_code
                ];
            });

            $formattedProduct['available_sizes'] = $availableSizes->map(function($size) {
                return [
                    'id' => $size->id,
                    'name' => $size->name,
                    'display_name' => $size->display_name
                ];
            });

            return response()->json([
                'product' => $formattedProduct,
                'related' => $relatedProducts,
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'المنتج غير موجود.'], 404);
        } catch (Exception $e) {
            Log::error("خطأ في جلب تفاصيل المنتج {$slug}: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    public function productsByIds(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:products,id',
        ]);

        try {
            $products = Product::whereIn('id', $validated['ids'])->get();

            // استخدام دالة مساعدة لتنسيق البيانات
            $formattedProducts = $products->map(fn($p) => $this->formatProductForCard($p));

            return response()->json($formattedProducts);

        } catch (\Exception $e) {
            Log::error('خطأ في جلب المنتجات بواسطة IDs: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
    private function formatProductForCard(Product $product)
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'regular_price' => (float)$product->regular_price,
            'sale_price' => isset($product->sale_price) ? (float)$product->sale_price : null,
            'thumbnail' => $product->thumbnail ? asset('storage/uploads/' . $product->thumbnail) : 'https://placehold.co/400x400?text=No+Image',
            'stock' => $product->quantity ?? 0,
        ];
    }
    /**
     * دالة مساعدة لتنسيق بيانات المنتج.
     */
    private function formatProduct(Product $product, $withDetails = false)
    {
        $data = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'SKU' => $product->SKU,
            'category' => $product->category->name ?? 'غير مصنف',
            'short_description' => $product->short_description,
            'regular_price' => (float)$product->regular_price,
            'sale_price' => isset($product->sale_price) ? (float)$product->sale_price : null,
            'thumbnail' => $product->thumbnail ? asset('storage/uploads/' . $product->thumbnail) : 'https://placehold.co/600x600?text=No+Image',
            'images' => array_map(fn($img) => asset('storage/uploads/' . $img), json_decode($product->images) ?? []),
        ];

        if ($withDetails) {
            $data['description'] = $product->description;
        }

        return $data;
    }
}
