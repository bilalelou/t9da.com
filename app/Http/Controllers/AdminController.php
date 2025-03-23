<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class AdminController extends Controller
{
    public function index(){
        return view('admin.index');
    }

    public function brands()
    {
        $brands = Brand::orderBy('id','DESC')->paginate(10);
        return view("admin.brands",compact('brands'));
    }

    public function add_brand()
    {
        return view("admin.brand-add");
    }

    public function add_brand_store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:brands,slug',
            'image' => 'mimes:png,jpg,jpeg|max:2048'
        ]);

        $brand = new Brand();
        $brand->name = $request->name;
        $brand->slug = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // ✅ تأكد أن `$image->getRealPath()` يعيد `string`
            $realPath = $image->getRealPath();
            if (!is_string($realPath)) {
                throw new \Exception('Invalid file path.');
            }

            $file_extension = $image->extension();
            $file_name = Carbon::now()->timestamp . '.' . $file_extension;

            // ✅ تمرير `image` و `file_name` كوسيطين
            $this->GenerateBrandThumbnailImage($image, $file_name);

            $brand->image = $file_name;
        }

        $brand->save();
        return redirect()->route('admin.brands')->with('status', 'Record has been added successfully!');
    }

    public function edit_brand($id)
    {
        $brand = Brand::find($id);
        return view("admin.brand-edit",compact('brand'));
    }

    public function update_brand(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:brands,slug,'.$request->id,
            'image' => 'mimes:png,jpg,jpeg|max:2048'
        ]);
        $brand = Brand::find($request->id);
        $brand->name = $request->name;
        $brand->slug = $request->slug;
        if($request->hasFile('image'))
        {
            if (File::exists(public_path('uploads/brands').'/'.$brand->image)) {
                File::delete(public_path('uploads/brands').'/'.$brand->image);
            }
            $image = $request->file('image');
            $file_extention = $request->file('image')->extension();
            $file_name = Carbon::now()->timestamp . '.' . $file_extention;
            $this->GenerateBrandThumbailImage($image,$file_name);
            $brand->image = $file_name;
        }
        $brand->save();
        return redirect()->route('admin.brands')->with('status','Record has been updated successfully !');
    }

    public function GenerateBrandThumbnailImage($image, $imageName)
    {
        $destinationPath = public_path('/images/brands');

        // Initialize ImageManager with GD driver
        $manager = new ImageManager(new Driver());

        $realPath = $image->getRealPath();
        if (!is_string($realPath)) {
            throw new \Exception('Invalid file path.');
        }

        $img = $manager->read($realPath);
        $img->cover(124, 124);

        // Create destination directory if it doesn't exist
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        $img->save($destinationPath . '/' . $imageName);
    }
    public function delete_brand($id)
    {
        $brand = Brand::find($id);
        if (File::exists(public_path('uploads/brands').'/'.$brand->image)) {
            File::delete(public_path('uploads/brands').'/'.$brand->image);
        }
        $brand->delete();
        return redirect()->route('admin.brands')->with('status','Record has been deleted successfully !');
    }

    public function categories()
    {
            $categories = Category::orderBy('id','DESC')->paginate(10);
            return view("admin.categories",compact('categories'));
    }

    public function add_category()
    {
        return view("admin.category-add");
    }

    public function add_category_store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:categories,slug',
            'image' => 'mimes:png,jpg,jpeg|max:2048'
        ]);

        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $image = $request->file('image');
        $file_extention = $request->file('image')->extension();
        $file_name = Carbon::now()->timestamp . '.' . $file_extention;
        $this->GenerateCategoryThumbailImage($image,$file_name);
        $category->image = $file_name;
        $category->save();
        return redirect()->route('admin.categories')->with('status','Record has been added successfully !');
    }

    public function GenerateCategoryThumbailImage($image, $imageName)
    {
        $destinationPath = public_path('/images/categories');
        $manager = new ImageManager(new Driver());
        $realPath = $image->getRealPath();
        if (!is_string($realPath)) {
            throw new \Exception('Invalid file path.');
        }
        $img = $manager->read($realPath);
        $img->cover(124,124);
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath,0777,true);
        }
        $img->save($destinationPath.'/'.$imageName);
    }

    public function category_edit($id)
    {
        $category = Category::find($id);
        return view("admin.category-edit",compact('category'));
    }



public function update_category(Request $request)
{
    $request->validate([
        'name' => 'required',
        'slug' => 'required|unique:categories,slug,'.$request->id,
        'image' => 'mimes:png,jpg,jpeg|max:2048'
    ]);

    $category = Category::find($request->id);
    $category->name = $request->name;
    $category->slug = $request->slug;
    if($request->hasFile('image'))
    {
        if (File::exists(public_path('uploads/categories').'/'.$category->image)) {
            File::delete(public_path('uploads/categories').'/'.$category->image);
        }
        $image = $request->file('image');
        $file_extention = $request->file('file')->extension();
        $file_name = Carbon::now()->timestamp . '.' . $file_extention;


        $this->GenerateCategoryThumbailImage($image,$file_name);
        $category->image = $file_name;
    }
    $category->save();
    return redirect()->route('admin.categories')->with('status','Record has been updated successfully !');
}

    public function delete_category($id)
    {
        $category = Category::find($id);
        if (File::exists(public_path('uploads/categories').'/'.$category->image)) {
            File::delete(public_path('uploads/categories').'/'.$category->image);
        }
        $category->delete();
        return redirect()->route('admin.categories')->with('status','Record has been deleted successfully !');
    }

    public function products()
    {
        $products = Product::orderBy('id','DESC')->paginate(10);
        return view("admin.products",compact('products'));
    }

    public function add_product()
    {
        $categories = Category::Select('id','name')->orderBy('name')->get();
        $brands = Brand::Select('id','name')->orderBy('name')->get();

        return view("admin.product-add",compact('categories','brands'));
    }
}
