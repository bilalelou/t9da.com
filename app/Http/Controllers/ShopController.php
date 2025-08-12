<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->query('size', 12);
        $order = $request->query('order', -1);
        $min_price = $request->query('min');
        $max_price = $request->query('max');
        $f_categories = $request->query('categories');
        $f_brands = $request->query('brands');

        $productsQuery = Product::query();

        if (!empty($f_brands)) {
            $brandsArray = explode(',', $f_brands);
            $productsQuery->whereIn('brand_id', $brandsArray);
        }

        if (!empty($f_categories)) {
            $categoriesArray = explode(',', $f_categories);
            $productsQuery->whereIn('category_id', $categoriesArray);
        }

        if ($min_price && $max_price) {
            $productsQuery->whereBetween('regular_price', [$min_price, $max_price]);
        }

        $o_column = 'created_at';
        $o_order = 'DESC';

        switch ($order) {
            case 1: $o_column = 'created_at'; $o_order = 'DESC'; break;
            case 2: $o_column = 'created_at'; $o_order = 'ASC'; break;
            case 3: $o_column = 'regular_price'; $o_order = 'ASC'; break;
            case 4: $o_column = 'regular_price'; $o_order = 'DESC'; break;
        }
        $productsQuery->orderBy($o_column, $o_order);

        $products = $productsQuery->paginate($size);

        $categories = Category::withCount('products')->orderBy("name", "ASC")->get();
        $brands = Brand::withCount('products')->orderBy("name", "ASC")->get();

        info($products);

        return view('shop', compact('products', 'size', 'order', 'brands', 'f_brands', 'categories', 'f_categories') + [
            'min_price' => $min_price ?? 1,
            'max_price' => $max_price ?? 1000
        ]);
    }


    public function product_details($product_slug)
    {
    $product = Product::with('variants')->where("slug", $product_slug)->firstOrFail();
    
    $rproducts = Product::where("slug", "<>", $product_slug)->inRandomOrder()->take(8)->get();

    $hasPurchased = false;
    if (Auth::check()) {
        $user = Auth::user();
        $hasPurchased = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->whereHas('orderItems', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();
    }

    return view('details', compact('product', 'rproducts', 'hasPurchased'));
    }
}
