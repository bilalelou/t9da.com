<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use App\Models\Slider;
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
            // 1. الشرائح (Slides) - من قاعدة البيانات
            $slides = Slider::active()->ordered()->get()->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'subtitle' => $slider->description,
                    'image_url' => $slider->image_url,
                    'link' => $slider->button_link ?? '/shop',
                    'button_text' => $slider->button_text
                ];
            });

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
                    'price' => (float)($variant->price ?? 0),
                    'stock' => (int)($variant->quantity ?? 0),
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

    public function search(Request $request)
    {
        try {
            $query = $request->input('query');
            $category = $request->input('category');
            $brand = $request->input('brand');
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $inStock = $request->input('in_stock');
            $featured = $request->input('featured');
            $minRating = $request->input('min_rating');

            // بناء استعلام البحث
            $searchQuery = Product::query()->with('category', 'brand');

            // البحث في اسم المنتج
            if ($query) {
                $searchQuery->where('name', 'LIKE', "%{$query}%");
            }

            // فلترة حسب التصنيف
            if ($category) {
                $searchQuery->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            }

            // فلترة حسب الماركة
            if ($brand) {
                $searchQuery->whereHas('brand', function ($q) use ($brand) {
                    $q->where('slug', $brand);
                });
            }

            // فلترة حسب السعر
            if ($minPrice) {
                $searchQuery->where('regular_price', '>=', $minPrice);
            }
            if ($maxPrice) {
                $searchQuery->where('regular_price', '<=', $maxPrice);
            }

            // فلترة حسب المخزون
            if ($inStock) {
                $searchQuery->where('quantity', '>', 0);
            }

            // فلترة حسب المنتجات المميزة
            if ($featured) {
                $searchQuery->where('featured', true);
            }

            // فلترة حسب التقييم
            if ($minRating) {
                $searchQuery->where('average_rating', '>=', $minRating);
            }

            // تنفيذ البحث
            $products = $searchQuery->paginate(12);
            $formattedProducts = $products->getCollection()->transform(fn($p) => $this->formatProduct($p));

            return response()->json([
                'products' => $formattedProducts,
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في البحث: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    public function offers(Request $request)
    {
        try {
            // جلب المنتجات التي لها سعر مخفض (offers)
            $offersQuery = Product::query()
                ->whereNotNull('sale_price')
                ->where('sale_price', '>', 0)
                ->with('category', 'brand');

            // فلترة حسب التصنيف
            if ($request->has('category') && !empty($request->input('category'))) {
                $offersQuery->whereHas('category', function ($q) use ($request) {
                    $q->where('slug', $request->input('category'));
                });
            }

            // فلترة حسب الماركة
            if ($request->has('brand') && !empty($request->input('brand'))) {
                $offersQuery->whereHas('brand', function ($q) use ($request) {
                    $q->where('slug', $request->input('brand'));
                });
            }

            // فلترة حسب السعر
            if ($request->has('min_price')) {
                $offersQuery->where('sale_price', '>=', $request->input('min_price'));
            }
            if ($request->has('max_price')) {
                $offersQuery->where('sale_price', '<=', $request->input('max_price'));
            }

            // فلترة حسب المخزون
            if ($request->has('in_stock') && $request->input('in_stock')) {
                $offersQuery->where('quantity', '>', 0);
            }

            // الترتيب
            switch ($request->input('sort')) {
                case 'price-asc':
                    $offersQuery->orderBy('sale_price', 'asc');
                    break;
                case 'price-desc':
                    $offersQuery->orderBy('sale_price', 'desc');
                    break;
                case 'discount-desc':
                    $offersQuery->orderByRaw('((regular_price - sale_price) / regular_price) DESC');
                    break;
                default:
                    $offersQuery->latest(); // الترتيب الافتراضي (الأحدث)
                    break;
            }

            // تنفيذ الاستعلام مع نظام الصفحات
            $offers = $offersQuery->paginate(12);
            $formattedOffers = $offers->getCollection()->transform(fn($p) => $this->formatProduct($p));

            return response()->json([
                'offers' => $formattedOffers,
                'pagination' => [
                    'total' => $offers->total(),
                    'per_page' => $offers->perPage(),
                    'current_page' => $offers->currentPage(),
                    'last_page' => $offers->lastPage(),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب العروض: ' . $e->getMessage());
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
            'stock' => (int)($product->quantity ?? 0),
            'stock_status' => $product->stock_status ?? 'instock',
            'has_free_shipping' => (bool)$product->has_free_shipping,
            'free_shipping_note' => $product->free_shipping_note,
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
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'brand' => $product->brand ? [
                'id' => $product->brand->id,
                'name' => $product->brand->name,
                'slug' => $product->brand->slug,
            ] : null,
            'short_description' => $product->short_description,
            'regular_price' => (float)$product->regular_price,
            'sale_price' => isset($product->sale_price) ? (float)$product->sale_price : null,
            'thumbnail' => $product->thumbnail ? asset('storage/uploads/' . $product->thumbnail) : 'https://placehold.co/600x600?text=No+Image',
            'images' => array_map(fn($img) => asset('storage/uploads/' . $img), json_decode($product->images) ?? []),
            'stock' => (int)($product->quantity ?? 0),
            'stock_status' => $product->stock_status ?? 'instock',
            'has_variants' => (bool)$product->has_variants,
            'average_rating' => round($product->average_rating, 1),
            'total_reviews' => $product->total_reviews,
            'has_free_shipping' => (bool)$product->has_free_shipping,
            'free_shipping_note' => $product->free_shipping_note,
        ];

        if ($withDetails) {
            $data['description'] = $product->description;
            $data['rating_breakdown'] = $product->rating_breakdown;
        }

        return $data;
    }
}
