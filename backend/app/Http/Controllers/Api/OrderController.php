<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\ShippingFee;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * عرض قائمة بجميع الطلبات.
     */
    public function index()
    {
        try {
            $orders = Order::with('user:id,name') // جلب بيانات المستخدم (العميل) مع الطلب
                ->latest()
                ->paginate(20);

            // تنسيق البيانات لتناسب الواجهة الأمامية
            $formattedOrders = $orders->getCollection()->transform(function ($order) {
                // تحويل delivered إلى completed للتوافق مع Frontend
                $status = $order->status === 'delivered' ? 'completed' : $order->status;

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? "#" . $order->id, // استخدم رقم الطلب إن وجد
                    'customer_name' => $order->user->name ?? 'عميل غير مسجل',
                    'total_price' => $order->total_price ?? 0, // تأكد من وجود هذا الحقل
                    'status' => $status, // استخدم الحالة المحولة
                    'created_at' => $order->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedOrders,
                'pagination' => [
                    'total' => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ]
            ]);
        } catch (Exception $e) {
            Log::error('خطأ في جلب الطلبات: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * إنشاء طلب جديد
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_info' => 'required|array',
            'shipping_info.fullName' => 'required|string|max:255',
            'shipping_info.email' => 'required|email',
            'shipping_info.phone' => 'required|string',
            'shipping_info.address' => 'required|string',
            'shipping_info.city' => 'required|string',
            'shipping_info.state' => 'required|string',
            'shipping_info.postalCode' => 'required|string',
            'shipping_info.shippingMethod' => 'required|string',
            'shipping_info.paymentMethod' => 'required|string',
            'order_summary' => 'required|array',
            'order_summary.total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // إنشاء الطلب
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
                'status' => 'pending',
                'total_price' => $request->order_summary['total'],
                'subtotal' => $request->order_summary['subtotal'],
                'shipping_cost' => $request->order_summary['shipping'],
                'tax_amount' => $request->order_summary['tax'],
                'discount_amount' => $request->order_summary['discount'] ?? 0,

                // معلومات الشحن
                'shipping_name' => $request->shipping_info['fullName'],
                'shipping_email' => $request->shipping_info['email'],
                'shipping_phone' => $request->shipping_info['phone'],
                'shipping_address' => $request->shipping_info['address'],
                'shipping_city' => $request->shipping_info['city'],
                'shipping_state' => $request->shipping_info['state'],
                'shipping_postal_code' => $request->shipping_info['postalCode'],
                'shipping_method' => $request->shipping_info['shippingMethod'],
                'payment_method' => $request->shipping_info['paymentMethod'],
            ]);

            // إضافة عناصر الطلب
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total' => $product->price * $item['quantity'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('خطأ في إنشاء الطلب: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الطلب'
            ], 500);
        }
    }

    /**
     * التحقق من صحة كوبون الخصم
     */
    public function validateCoupon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $coupon = Coupon::where('code', $request->code)
                ->where('is_active', true)
                ->where('expires_at', '>', now())
                ->first();

            if (!$coupon) {
                return response()->json([
                    'success' => false,
                    'message' => 'كوبون الخصم غير صحيح أو منتهي الصلاحية'
                ], 404);
            }

            // التحقق من الحد الأدنى للطلب
            if ($request->total < $coupon->min_amount) {
                return response()->json([
                    'success' => false,
                    'message' => "الحد الأدنى للطلب هو {$coupon->min_amount} درهم"
                ], 400);
            }

            // حساب قيمة الخصم
            $discount = 0;
            if ($coupon->type === 'percentage') {
                $discount = ($request->total * $coupon->value) / 100;
                if ($coupon->max_amount && $discount > $coupon->max_amount) {
                    $discount = $coupon->max_amount;
                }
            } else {
                $discount = $coupon->value;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'discount' => $discount,
                    'code' => $coupon->code,
                    'description' => $coupon->description,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في التحقق من الكوبون: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التحقق من الكوبون'
            ], 500);
        }
    }

    /**
     * حساب تكلفة الشحن
     */
    public function getShippingCosts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'city' => 'required|string',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // جلب معرفات المنتجات من السلة
            $productIds = collect($request->items)->pluck('id');
            $products = Product::whereIn('id', $productIds)->get();
            
            // فحص إذا كانت جميع المنتجات لها شحن مجاني
            $allProductsHaveFreeShipping = $products->every(function ($product) {
                return $product->has_free_shipping;
            });
            
            // إذا كانت جميع المنتجات لها شحن مجاني
            if ($allProductsHaveFreeShipping && $products->isNotEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'standard' => 0,
                        'express' => 0,
                        'overnight' => 0,
                        'free_shipping_threshold' => null,
                        'message' => 'شحن مجاني - جميع المنتجات تتضمن شحن مجاني',
                        'has_free_shipping_products' => true
                    ]
                ]);
            }

            // الشحن المجاني للطلبات أكثر من 500 درهم (للمنتجات العادية)
            if ($request->total >= 500) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'standard' => 0,
                        'express' => 30,
                        'overnight' => 50,
                        'free_shipping_threshold' => 500,
                        'message' => 'شحن مجاني للطلبات أكثر من 500 درهم',
                        'has_free_shipping_products' => false
                    ]
                ]);
            }

            // البحث عن تكلفة الشحن حسب المدينة
            $city = City::where('name', $request->city)->first();
            $standardCost = $city ? $city->price : 50; // 50 درهم افتراضي

            // حساب الشحن المختلط (بعض المنتجات لها شحن مجاني وبعضها لا)
            $freeShippingProducts = $products->filter(fn($p) => $p->has_free_shipping);
            $paidShippingProducts = $products->filter(fn($p) => !$p->has_free_shipping);
            
            $shippingMessage = '';
            if ($freeShippingProducts->isNotEmpty() && $paidShippingProducts->isNotEmpty()) {
                $shippingMessage = sprintf(
                    'الشحن مجاني لـ %d من أصل %d منتجات',
                    $freeShippingProducts->count(),
                    $products->count()
                );
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'standard' => $standardCost,
                    'express' => $standardCost + 30,
                    'overnight' => $standardCost + 50,
                    'free_shipping_threshold' => 500,
                    'message' => $shippingMessage,
                    'has_free_shipping_products' => $freeShippingProducts->isNotEmpty(),
                    'free_shipping_count' => $freeShippingProducts->count(),
                    'paid_shipping_count' => $paidShippingProducts->count(),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في حساب تكلفة الشحن: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حساب تكلفة الشحن'
            ], 500);
        }
    }

    /**
     * عرض تفاصيل طلب محدد
     */
    public function show($id)
    {
        try {
            $order = Order::with(['orderItems.product', 'user'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $order
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب تفاصيل الطلب: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'الطلب غير موجود'
            ], 404);
        }
    }

    /**
     * تحديث حالة الطلب
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,processing,shipped,completed,delivered,cancelled',
            'notes' => 'nullable|string|max:1000', // إضافة دعم للملاحظات
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $order = Order::findOrFail($id);

            // تحويل completed إلى delivered للتوافق مع قاعدة البيانات
            $status = $request->status === 'completed' ? 'delivered' : $request->status;

            $updateData = ['status' => $status];

            // إضافة الملاحظات إذا تم توفيرها
            if ($request->has('notes') && !empty($request->notes)) {
                $updateData['notes'] = $request->notes;
            }

            $order->update($updateData);

            // إرجاع الحالة كما يتوقعها Frontend
            $orderData = $order->toArray();
            if ($orderData['status'] === 'delivered') {
                $orderData['status'] = 'completed';
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الطلب بنجاح',
                'data' => $orderData
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في تحديث حالة الطلب: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث حالة الطلب'
            ], 500);
        }
    }
}
