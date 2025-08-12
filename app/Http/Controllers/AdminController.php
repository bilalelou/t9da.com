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
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Faker\Provider\Image;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
    // brands part//
    public function brands()
    {
    $brands = Brand::withCount('products')->orderBy('id','DESC')->paginate(10);
        return view("admin.brands",compact('brands'));
    }

    public function add_brand()
    {
        return view("admin.brand-add");
    }


    public function add_brand_store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:brands,slug',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048'
        ]);

        $brand = new Brand();
        $brand->name = $request->name;
        $brand->slug = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $file_name = Carbon::now()->timestamp . '.' . $image->extension();


            $image->storeAs('brands', $file_name, 'public_uploads');

            $brand->image = $file_name;
        }

        $brand->save();
        return redirect()->route('admin.brands')->with('status', 'Brand has been added successfully!');
    }

    public function edit_brand($id)
    {
        $brand = Brand::find($id);
        return view("admin.brand-edit",compact('brand'));
    }

    public function update_brand(Request $request)
    {
        $brand = Brand::findOrFail($request->id);

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:brands,slug,' . $brand->id,
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048' // nullable للسماح بالتحديث بدون تغيير الصورة
        ]);

        $brand->name = $request->name;
        $brand->slug = $request->slug;

        if ($request->hasFile('image')) {
            if ($brand->image) {
                Storage::disk('public_uploads')->delete('brands/' . $brand->image);
            }

            $image = $request->file('image');
            $file_name = Carbon::now()->timestamp . '.' . $image->extension();
            $image->storeAs('brands', $file_name, 'public_uploads');
            $brand->image = $file_name;
        }

        $brand->save();
        return redirect()->route('admin.brands')->with('status', 'Brand has been updated successfully!');
    }

    public function delete_brand($id)
    {
        $brand = Brand::findOrFail($id);

        if($brand->image)
        {
            Storage::disk('public_uploads')->delete('brands/' . $brand->image);
        }

        $brand->delete();
        return redirect()->route('admin.brands')->with('status', 'Brand has been deleted successfully!');
    }
    //end brands part//

    public function categories()
    {
        $categories = Category::withCount('products')->orderBy('id','DESC')->paginate(10);
        return view("admin.categories",compact('categories'));
    }

    public function add_category()
    {
        return view("admin.category-add");
    }

    public function add_category_store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:categories,slug',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048' // الصورة مطلوبة عند إنشاء فئة جديدة
        ]);

        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $file_name = Carbon::now()->timestamp . '.' . $image->extension();

            $image->storeAs('categories', $file_name, 'public_uploads');

            $category->image = $file_name;
        }

        $category->save();
        return redirect()->route('admin.categories')->with('status', 'Category has been added successfully!');
    }

    public function category_edit($id)
    {
        $category = Category::find($id);
        return view("admin.category-edit",compact('category'));
    }

    public function update_category(Request $request)
    {
        $category = Category::findOrFail($request->id);

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:categories,slug,' . $category->id,
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048' // nullable للسماح بالتحديث بدون تغيير الصورة
        ]);

        $category->name = $request->name;
        $category->slug = $request->slug;

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public_uploads')->delete('categories/' . $category->image);
            }

            $image = $request->file('image');
            $file_name = Carbon::now()->timestamp . '.' . $image->extension();
            $image->storeAs('categories', $file_name, 'public_uploads');
            $category->image = $file_name;
        }

        $category->save();
        return redirect()->route('admin.categories')->with('status', 'Category has been updated successfully!');
    }

    public function delete_category($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image) {
            Storage::disk('public_uploads')->delete('categories/' . $category->image);
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
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:products,slug',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'short_description' => 'required',
            'description' => 'required',
            'regular_price' => 'required|numeric|min:0',
             'sale_price' => 'required|numeric',
            'SKU' => 'required',
            'stock_status' => 'required',
            'featured' => 'required',
            'quantity' => 'required|integer',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'images.*' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $product = new Product();
        $product->fill($request->except('image', 'images'));
        $product->slug = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public_uploads');
            $product->image = $path;
        }

        if ($request->hasFile('images')) {
            $gallery_paths = [];
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public_uploads');
                $gallery_paths[] = $path;
            }
            $product->images = implode(',', $gallery_paths);
        }

        $product->save();

        return redirect()->route('admin.products')->with('status', 'Product has been added successfully!');
    }

    public function GenerateThumbnailImage($image, $imageName)
    {
        $destinationPathThumbnails = public_path('/uploads/products/thumbnails');
        $destinationPath = public_path('/uploads/products');

        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }
        if (!file_exists($destinationPathThumbnails)) {
            mkdir($destinationPathThumbnails, 0777, true);
        }

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
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:products,slug,' . $request->id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'SKU' => 'required|string|max:100',
            'stock_status' => 'required|in:instock,outofstock',
            'featured' => 'required|boolean',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'images.*' => 'nullable|image|mimes:png,jpg,jpeg|max:2048'
        ]);

        $product = Product::findOrFail($request->id); // استخدام findOrFail أفضل

        $product->name = $request->name;
        $product->slug = Str::slug($request->name); // يمكنك استخدام slug من الـ request مباشرة
        $product->short_description = $request->short_description;
        $product->description = $request->description;
        $product->regular_price = $request->regular_price;
        $product->sale_price = $request->sale_price;
        $product->SKU = $request->SKU;
        $product->stock_status = $request->stock_status;
        $product->featured = $request->featured;
        $product->quantity = $request->quantity;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public_uploads')->exists($product->image)) {
                Storage::disk('public_uploads')->delete($product->image);
            }

            $image_file = $request->file('image');
            $file_name = time() . '.' . $image_file->getClientOriginalExtension();
            $path = $image_file->storeAs('products', $file_name, 'public_uploads');
            $product->image = $path; // $path سيكون 'products/filename.jpg'
        }

        if ($request->hasFile('images')) {
            if ($product->images) {
                $old_gallery = explode(',', $product->images);
                foreach ($old_gallery as $old_image) {
                    if (Storage::disk('public_uploads')->exists(trim($old_image))) {
                        Storage::disk('public_uploads')->delete(trim($old_image));
                    }
                }
            }

            $gallery_paths = [];
            $counter = 1;
            foreach ($request->file('images') as $file) {
                $gfilename = time() . '-' . $counter . '.' . $file->getClientOriginalExtension();
                $gpath = $file->storeAs('products', $gfilename, 'public_uploads');
                $gallery_paths[] = $gpath;
                $counter++;
            }
            $product->images = implode(',', $gallery_paths); // استخدام فاصلة فقط بدون مسافة
        }

        $product->save();

        return redirect()->route('admin.products')->with('status', 'Product has been updated successfully!');
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
        $request->validate([
            'code' => 'required|unique:coupons,code',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'cart_value' => 'required|numeric',
            'expiry_date' => 'required|date|after_or_equal:today',
        ]);

        $coupon = new Coupon();
        $coupon->code = $request->code;
        $coupon->type = $request->type;
        $coupon->value = $request->value;
        $coupon->cart_value = $request->cart_value;
        $coupon->expiry_date = $request->expiry_date;
        $coupon->save();

        return redirect()->route("admin.coupons")->with('status','Coupon has been added successfully!');
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

    public function order_details($order_id)
    {

        $order = Order::with('orderItems.product')->findOrFail($order_id);

        return view('admin.order-details', compact('order'));
    }

    public function update_order_status(Request $request, $order_id)
    {
        $order = Order::findOrFail($order_id);

        $request->validate([
            'order_status' => 'required|in:ordered,shipped,delivered,canceled'
        ]);

        $order->status = $request->order_status;

        if ($request->order_status == 'delivered') {
            $order->delivered_date = Carbon::now();
        } elseif ($request->order_status == 'canceled') {
            $order->canceled_date = Carbon::now();
        }

        $order->save();

        // تحديث حالة المعاملة (Transaction) إذا كان الطلب قد تم توصيله
        if ($order->status == 'delivered') {
            // نفترض وجود علاقة 'transaction' في مودل Order
            $transaction = $order->transaction;
            if ($transaction) {
                $transaction->status = 'approved';
                $transaction->save();
            }
        }

        return redirect()->back()->with("status", "Order status has been updated successfully!");
    }

    public function order_tracking(Request $request)
    {
        $query = Order::with(['orderItems.product', 'user']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'LIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status_filter')) {
            $query->where('status', $request->status_filter);
        }

        $orders = $query->orderBy('created_at', 'DESC')->paginate(15);

        return view('admin.order-tracking', compact('orders'));
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
            'tagline'  => 'required',
            'title'    => 'required',
            'subtitle' => 'required',
            'link'     => 'required',
            'status'   => 'required',
            'image'    => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $slide = new Slide();
        $slide->fill($request->except('image'));

        if ($request->hasFile('image')) {

            $path = $request->file('image')->store('slides', 'public_uploads');

            $slide->image = $path;
        }

        $slide->save();

        return redirect()->route('admin.slides')->with('status', 'Slide has been added successfully!');
    }

    public function slide_edit($id)
    {
        $slide = Slide::find($id);
        info($slide);
        return view('admin.slide-edit', compact('slide'));
    }

    public function slide_update(Request $request)
    {
        $slide = Slide::findOrFail($request->id);

        $request->validate([
            'tagline'  => 'required',
            'title'    => 'required',
            'subtitle' => 'required',
            'link'     => 'required',
            'status'   => 'required',
            'image'    => 'nullable|image|mimes:png,jpg,jpeg|max:2048', // nullable للسماح بالتحديث بدون تغيير الصورة
        ]);

        $slide->fill($request->except('image'));

        if ($request->hasFile('image')) {
            if ($slide->image) {
                Storage::disk('public_uploads')->delete($slide->image);
            }

            $path = $request->file('image')->store('slides', 'public_uploads');
            $slide->image = $path;
        }

        $slide->save();

        return redirect()->route('admin.slides')->with("status", "Slide has been updated successfully!");
    }

    public function slide_delete($id)
    {
        $slide = Slide::findOrFail($id);

        if ($slide->image) {
            Storage::disk('public_uploads')->delete($slide->image);
        }

        $slide->delete();

        return redirect()->route('admin.slides')->with("status", "Slide has been deleted successfully!");
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

    public function search(Request $request)
    {
        $query = $request->input('query');
        info($query);

        $results = Product::where('name', 'LIKE', "%{$query}%")
                    ->take(8)
                    ->get();
        info($results);

        return response()->json($results);
    }

    public function users()
    {
    $users = User::withCount('orders')->orderBy('id', 'DESC')->paginate(12);
        info($users);
        return view('admin.users', compact('users'));
    }

    public function user_edit($id)
    {
        $user = User::find($id);
        return view('admin.user-edit', compact('user'));
    }

}
