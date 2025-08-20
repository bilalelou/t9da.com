<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * عرض قائمة بجميع التصنيفات
     */
    public function index()
    {
        // جلب أول 4 تصنيفات للعرض في الصفحة الرئيسية
        $categories = Category::latest()->take(4)->get();
        info($categories);
        return CategoryResource::collection($categories);
    }
}
