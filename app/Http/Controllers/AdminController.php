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
use Faker\Provider\Image;
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

public function product_store(Request $request)
{
    // تحقق من صحة البيانات
    $request->validate([
        'name' => 'required',
        'slug' => 'required|unique:products,slug',
        'category_id' => 'required',
        'brand_id' => 'required',
        'short_description' => 'required',
        'description' => 'required',
        'regular_price' => 'required|numeric',
        'sale_price' => 'required|numeric',
        'SKU' => 'required',
        'stock_status' => 'required',
        'featured' => 'required',
        'quantity' => 'required|integer',
        'image' => 'required|mimes:png,jpg,jpeg|max:2048',
        'images.*' => 'nullable|mimes:png,jpg,jpeg|max:2048',
    ]);

    try {
        $product = new Product();
        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->short_description = $request->short_description;
        $product->description = $request->description;
        $product->regular_price = $request->regular_price;
        $product->sale_price = $request->sale_price;
        $product->SKU = $request->SKU;
        $product->stock_status = $request->stock_status;
        $product->featured = $request->featured;
        $product->quantity = $request->quantity;
        $current_timestamp = Carbon::now()->timestamp;

        // Handle main image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $current_timestamp . '.' . $image->extension();
            $this->GenerateThumbnailImage($image, $imageName);
            $product->image = $imageName;
        }

        // Handle gallery images upload
        $gallery_arr = [];
        if ($request->hasFile('images')) {
            $allowedfileExtension = ['jpg', 'png', 'jpeg'];
            $files = $request->file('images');
            foreach ($files as $file) {
                $gextension = $file->getClientOriginalExtension();
                if (in_array($gextension, $allowedfileExtension)) {
                    $gfilename = $current_timestamp . "-" . (count($gallery_arr) + 1 . "." . $gextension);
                    $this->GenerateThumbnailImage($file, $gfilename);
                    array_push($gallery_arr, $gfilename);
                }
            }
            $product->images = implode(',', $gallery_arr);
        }

        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->save();

        return redirect()->route('admin.products')->with('status', 'Record has been added successfully!');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'An error occurred while saving the product: ' . $e->getMessage());
    }
}

public function GenerateThumbnailImage($image, $imageName)
{
    // مسارات الحفظ
    $destinationPathThumbnails = public_path('/uploads/products/thumbnails');
    $destinationPath = public_path('/uploads/products');

    // إنشاء المجلدات إذا لم تكن موجودة
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true);
    }
    if (!file_exists($destinationPathThumbnails)) {
        mkdir($destinationPathThumbnails, 0777, true);
    }

    // الحصول على نوع الصورة
    $imageType = exif_imagetype($image->path());

    // تحميل الصورة بناءً على نوعها
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            $sourceImage = imagecreatefromjpeg($image->path());
            break;
        case IMAGETYPE_PNG:
            $sourceImage = imagecreatefrompng($image->path());
            break;
        default:
            throw new \Exception("Unsupported image type");
    }

    // الحصول على أبعاد الصورة الأصلية
    $width = imagesx($sourceImage);
    $height = imagesy($sourceImage);

    // تحديد الأبعاد الجديدة
    $newWidth = 540;
    $newHeight = 689;

    // إنشاء صورة جديدة بالأبعاد المطلوبة
    $newImage = imagecreatetruecolor($newWidth, $newHeight);

    // تغيير حجم الصورة
    imagecopyresampled($newImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // حفظ الصورة الرئيسية
    imagejpeg($newImage, $destinationPath . '/' . $imageName);

    // إنشاء صورة مصغرة
    $thumbnailWidth = 104;
    $thumbnailHeight = 104;
    $thumbnailImage = imagecreatetruecolor($thumbnailWidth, $thumbnailHeight);
    imagecopyresampled($thumbnailImage, $sourceImage, 0, 0, 0, 0, $thumbnailWidth, $thumbnailHeight, $width, $height);

    // حفظ الصورة المصغرة
    imagejpeg($thumbnailImage, $destinationPathThumbnails . '/' . $imageName);

    // تحرير الذاكرة
    imagedestroy($sourceImage);
    imagedestroy($newImage);
    imagedestroy($thumbnailImage);
}

public function product_edit($id)
{
    $product = Product::find($id);
    $categories = Category::Select('id','name')->orderBy('name')->get();
    $brands = Brand::Select('id','name')->orderBy('name')->get();

    return view('admin.product-edit',compact('product','categories','brands'));
}

public function update_product(Request $request)
{
    $request->validate([
        'name'=>'required',
        'slug'=>'required|unique:products,slug,'.$request->id,
        'category_id'=>'required',
        'brand_id'=>'required',
        'short_description'=>'required',
        'description'=>'required',
        'regular_price'=>'required',
        'sale_price'=>'required',
        'SKU'=>'required',
        'stock_status'=>'required',
        'featured'=>'required',
        'quantity'=>'required',
        'image'=>'required|mimes:png,jpg,jpeg|max:2048'
    ]);

    $product = Product::find($request->id);
    $product->name = $request->name;
    $product->slug = Str::slug($request->name);
    $product->short_description = $request->short_description;
    $product->description = $request->description;
    $product->regular_price = $request->regular_price;
    $product->sale_price = $request->sale_price;
    $product->SKU = $request->SKU;
    $product->stock_status = $request->stock_status;
    $product->featured = $request->featured;
    $product->quantity = $request->quantity;
    $current_timestamp = Carbon::now()->timestamp;

    if($request->hasFile('image'))
    {
        $product->image = $request->image;
        $file_extention = $request->file('image')->extension();
        $file_name = $current_timestamp . '.' . $file_extention;
        $path = $request->image->storeAs('products', $file_name, 'public_uploads');
        $product->image = $path;
    }

    $gallery_arr = array();
    $gallery_images = "";
    $counter = 1;

    if($request->hasFile('images'))
    {
        $allowedfileExtension=['jpg','png','jpeg'];
        $files = $request->file('images');
        foreach($files as $file){
            $gextension = $file->getClientOriginalExtension();
            $check=in_array($gextension,$allowedfileExtension);
            if($check)
            {
                $gfilename = $current_timestamp . "-" . $counter . "." . $gextension;
                $gpath = $file->storeAs('products', $gfilename, 'public_uploads');
                array_push($gallery_arr,$gpath);
                $counter = $counter + 1;
            }
        }
        $gallery_images = implode(', ', $gallery_arr);
    }
    $product->images = $gallery_images;

    $product->save();
    return redirect()->route('admin.products')->with('status','Record has been updated successfully !');
}

}
