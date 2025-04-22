<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Slide;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function index()
    {
        $slides = Slide::where('status', 1)->take(3)->get();

        $categories = Category::orderBy('name')->get();

        $sproducts = Product::whereNotNull('sale_price')
                    ->where('sale_price', '<>', "")
                    ->inRandomOrder()
                    ->take(8)
                    ->get();
        $fproducts = Product::where('featured', 1)->take(8)->get();

        return view('index', compact('slides', 'categories', 'sproducts', 'fproducts'));
    }
}
