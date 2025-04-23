<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Slide;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Faker\Provider\Image;
use Illuminate\Support\Facades\Session;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Drivers\Gd\Driver;
use Surfsidemedia\Shoppingcart\Facades\Cart;

class AdminController extends Controller
{
    public function index(){
        $orders = Order::orderBy('created_at', 'DESC')->get()->take(10);

        $dashboardDatas = DB::select("
            SELECT
                SUM(total) AS TotalAmount,
                SUM(IF(status='ordered', total, 0)) AS TotalOrderedAmount,
                SUM(IF(status='delivered', total, 0)) AS TotalDeliveredAmount,
                SUM(IF(status='canceled', total, 0)) AS TotalCanceledAmount,
                COUNT(*) AS Total,
                SUM(IF(status='ordered', 1, 0)) AS TotalOrdered,
                SUM(IF(status='delivered', 1, 0)) AS TotalDelivered,
                SUM(IF(status='canceled', 1, 0)) AS TotalCanceled
            FROM orders
        ");

        $monthlyDatas = DB::select("
            SELECT
                M.id AS MonthID,
                M.name AS MonthName,
                IFNULL(D.TotalAmount, 0) AS TotalAmount,
                IFNULL(D.TotalOrderedAmount, 0) AS TotalOrderedAmount,
                IFNULL(D.TotalDeliveredAmount, 0) AS TotalDeliveredAmount,
                IFNULL(D.TotalCanceledAmount, 0) AS TotalCanceledAmount
            FROM month_names M
            LEFT JOIN (
                SELECT
                    MONTH(created_at) AS MonthNo,
                    SUM(total) AS TotalAmount,
                    SUM(IF(status = 'ordered', total, 0)) AS TotalOrderedAmount,
                    SUM(IF(status = 'delivered', total, 0)) AS TotalDeliveredAmount,
                    SUM(IF(status = 'canceled', total, 0)) AS TotalCanceledAmount
                FROM orders
                WHERE YEAR(created_at) = YEAR(NOW())
                GROUP BY MONTH(created_at)
            ) D ON D.MonthNo = M.id
            ORDER BY M.id
        ");

        $amountM          = implode(',', collect($monthlyDatas)->pluck('TotalAmount')->toArray());
        $orderedAmountM   = implode(',', collect($monthlyDatas)->pluck('TotalOrderedAmount')->toArray());
        $deliveredAmountM = implode(',', collect($monthlyDatas)->pluck('TotalDeliveredAmount')->toArray());
        $canceledAmountM  = implode(',', collect($monthlyDatas)->pluck('TotalCanceledAmount')->toArray());

        $totalAmount          = collect($monthlyDatas)->sum('TotalAmount');
        $totalOrderedAmount   = collect($monthlyDatas)->sum('TotalOrderedAmount');
        $totalDeliveredAmount = collect($monthlyDatas)->sum('TotalDeliveredAmount');
        $totalCanceledAmount  = collect($monthlyDatas)->sum('TotalCanceledAmount');

        return view('admin.index', compact('orders', 'dashboardDatas','amountM','orderedAmountM','deliveredAmountM','canceledAmountM','totalAmount','totalOrderedAmount','totalDeliveredAmount','totalCanceledAmount'));
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
            'image'=>'mimes:png,jpg,jpeg|max:2048'
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

    public function delete_product($id)
    {
        $product = Product::find($id);
        $product->delete();
        return redirect()->route('admin.products')->with('status','Record has been deleted successfully !');
    }

    public function coupons()
    {
            $coupons = Coupon::orderBy("expiry_date","DESC")->paginate(12);
            return view("admin.coupons",compact("coupons"));
    }
    public function add_coupon()
    {
        return view("admin.coupon-add");
    }

    public function add_coupon_store(Request $request)
    {
        info($request->all());
        $request->validate([
            'code' => 'required',
            'type' => 'required',
            'value' => 'required|numeric',
            'cart_value' => 'required|numeric',
            'expiry_date' => 'required|date'
        ]);
        $coupon = new Coupon();
        $coupon->code = $request->code;
        $coupon->type = $request->type;
        $coupon->value = $request->value;
        $coupon->cart_value = $request->cart_value;
        $coupon->expiry_date = $request->expiry_date;
        $coupon->save();
        return redirect()->route("admin.coupons")->with('status','Record has been added successfully !');
    }

    public function coupon_edit($id)
    {
        $coupon = Coupon::find($id);
        return view("admin.coupon-edit",compact("coupon"));
    }

    public function update_coupon(Request $request)
    {
        $request->validate([
        'code' => 'required',
        'type' => 'required',
        'value' => 'required|numeric',
        'cart_value' => 'required|numeric',
        'expiry_date' => 'required|date'
        ]);
        $coupon = Coupon::find($request->id);
        $coupon->code = $request->code;
        $coupon->type = $request->type;
        $coupon->value = $request->value;
        $coupon->cart_value = $request->cart_value;
        $coupon->expiry_date = $request->expiry_date;
        $coupon->save();
        return redirect()->route('admin.coupons')->with('status','Record has been updated successfully !');
    }

    public function delete_coupon($id)
    {
        $coupon = Coupon::find($id);
        $coupon->delete();
        return redirect()->route('admin.coupons')->with('status','Record has been deleted successfully !');
    }

    public function orders()
    {
        $orders = Order::orderBy('created_at','DESC')->paginate(12);
        return view("admin.orders",compact('orders'));
    }

    public function Order_details($order_id)
    {
        $order = Order::findOrFail($order_id);
        $orderItems = OrderItem::where('order_id', $order_id)->orderBy('id')->paginate(12);
        $transaction = Transaction::where('order_id', $order_id)->first();

        return view('admin.order-details', compact('order', 'orderItems', 'transaction'));
    }

    public function update_order_status(Request $request){
        $order = Order::find($request->order_id);
        $order->status = $request->order_status;
        if($request->order_status == 'delivered')
        {
            $order->delivered_date = Carbon::now();
        }
        elseif($request->order_status =='canceled')
        {
            $order->canceled_date = Carbon::now();
        }
        $order->save();
        if($request->order_status == 'delivered')
        {
            $transaction = Transaction::where('order_id', $request->order_id)->first();
            $transaction->status = 'approved';
            $transaction->save();
        }

        return back()->with("status", "status changed successfully!");
    }

    public function slides()
    {
        $slides = Slide::orderBy('id', 'DESC')->paginate(12);
        return view('admin.slides', compact('slides'));
    }
    public function slide_add()
    {
        return view('admin.slide-add');
    }

    public function slide_store(Request $request)
    {
        $request->validate([
            'tagline'   => 'required',
            'title'     => 'required',
            'subtitle'  => 'required',
            'link'      => 'required',
            'status'    => 'required',
            'image'     => 'required|mimes:png,jpg,jpeg|max:2048',
        ]);

        $slide = new Slide();
        $slide->tagline  = $request->tagline;
        $slide->title    = $request->title;
        $slide->subtitle = $request->subtitle;
        $slide->link     = $request->link;
        $slide->status   = $request->status;

        $image = $request->file('image');
        $file_extension = $image->extension();
        $file_name = Carbon::now()->timestamp . '.' . $file_extension;

        $this->GenerateSlideThumbnailsImage($image, $file_name);
        $slide->image = $file_name;

        $slide->save();

        return redirect()->route('admin.slides')->with('status', 'Record has been added successfully!');
    }

    public function GenerateSlideThumbnailsImage($imageFile, $imageName)
    {
        $destinationPath = public_path('uploads/slides');

        $manager = new ImageManager(new GdDriver());

        $img = $manager->read($imageFile->getPathname());

        $img->resize(400, 690, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath . '/' . $imageName);
    }

    public function slide_edit($id)
    {
        $slide = Slide::find($id);
        info($slide);
        return view('admin.slide-edit', compact('slide'));
    }

    public function slide_update(Request $request)
    {
        $request->validate([
            'tagline'   => 'required',
            'title'     => 'required',
            'subtitle'  => 'required',
            'link'      => 'required',
            'status'    => 'required',
            'image'     => 'mimes:png,jpg,jpeg|max:2048',
        ]);

        $slide = Slide::find($request->id);
        $slide->tagline  = $request->tagline;
        $slide->title    = $request->title;
        $slide->subtitle = $request->subtitle;
        $slide->link     = $request->link;
        $slide->status   = $request->status;

        if ($request->hasFile('image')) {
            if (File::exists(public_path('uploads/slides/') . '/' . $slide->image)) {
                File::delete(public_path('uploads/slides/') . '/' . $slide->image);
            }

            $image = $request->file('image');
            $file_extension = $image->extension();
            $file_name = Carbon::now()->timestamp . '.' . $file_extension;

            $this->GenerateSlideThumbnailsImage($image, $file_name);
            $slide->image = $file_name;
        }

        $slide->save();

        return redirect()->route('admin.slides')->with("status", "Slide updated successfully!");
    }

    public function slide_delete($id)
    {
        $slide = Slide::find($id);

        if (file::exists(public_path('uploads/slides') . '/' . $slide->image)) {
            File::delete(public_path('uploads/slides') . '/' . $slide->image);
        }

        $slide->delete();

        return redirect()->route('admin.slides')->with("status", "Slide deleted successfully!");
    }

    public function contacts()
    {
        $contacts = DB::table('contacts')->orderBy('id', 'DESC')->paginate(12);
        return view('admin.contacts', compact('contacts'));
    }
    public function contact_delete($id)
    {
        DB::table('contacts')->where('id', $id)->delete();
        return redirect()->route('admin.contacts')->with('status', 'Record has been deleted successfully !');
    }
}
