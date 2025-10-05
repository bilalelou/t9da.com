<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\ShippingFee;
use App\Models\City;
use App\Models\Invoice;
use App\Models\Setting;
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
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 20); // عدد العناصر لكل صفحة
            $page = $request->get('page', 1); // رقم الصفحة

            // تحديد الحد الأقصى لعدد العناصر لكل صفحة
            $perPage = min($perPage, 100);

            $orders = Order::with(['user:id,name', 'invoice']) // جلب بيانات المستخدم والفاتورة
                ->latest()
                ->paginate($perPage, ['*'], 'page', $page);

            // تنسيق البيانات لتناسب الواجهة الأمامية
            $formattedOrders = $orders->getCollection()->transform(function ($order) {
                // تحويل delivered إلى completed للتوافق مع Frontend
                $status = $order->status === 'delivered' ? 'completed' : $order->status;

                $orderData = [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? "#" . $order->id,
                    'customer_name' => $order->user->name ?? 'عميل غير مسجل',
                    'total_amount' => (float)($order->total_amount ?? $order->total ?? 0),
                    'status' => $status,
                    'created_at' => $order->created_at,
                    'name' => $order->name,
                    'phone' => $order->phone,
                    'address' => $order->address,
                    'city' => $order->city,
                    'notes' => $order->notes,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status ?? 'pending',
                ];

                // إضافة معلومات الفاتورة إذا كانت موجودة
                if ($order->invoice) {
                    $orderData['invoice'] = [
                        'id' => $order->invoice->id,
                        'invoice_code' => $order->invoice->invoice_code,
                        'status' => $order->invoice->status,
                        'amount' => $order->invoice->amount,
                        'bank_name' => $order->invoice->bank_name,
                        'account_number' => $order->invoice->account_number,
                        'payment_proof' => $order->invoice->payment_proof,
                        'created_at' => $order->invoice->created_at,
                    ];
                    $orderData['has_invoice'] = true;
                    $orderData['invoice_url'] = "/invoices/" . $order->invoice->id;
                } else {
                    $orderData['invoice'] = null;
                    $orderData['has_invoice'] = false;
                    $orderData['invoice_url'] = null;
                }

                // إضافة رقم الفاتورة من الطلب إذا لم تكن هناك فاتورة منفصلة
                if (!$order->invoice && $order->invoice_code) {
                    $orderData['invoice_code'] = $order->invoice_code;
                }

                return $orderData;
            });

            return response()->json([
                'success' => true,
                'data' => $formattedOrders,
                'pagination' => [
                    'total' => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
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
        // إضافة تسجيل للتحقق من حالة المصادقة
        Log::info('طلب إنشاء طلب جديد', [
            'has_auth_header' => $request->hasHeader('Authorization'),
            'auth_header' => $request->header('Authorization') ? substr($request->header('Authorization'), 0, 20) . '...' : null,
            'user_id' => Auth::id(),
            'user' => Auth::user() ? ['id' => Auth::user()->id, 'name' => Auth::user()->name, 'email' => Auth::user()->email] : null,
            'request_data' => $request->all()
        ]);

        // التحقق من وجود مستخدم مسجل دخول أولاً
        if (!Auth::check()) {
            Log::error('محاولة إنشاء طلب بدون مصادقة', [
                'headers' => $request->headers->all(),
                'ip' => $request->ip()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_info' => 'required|array',
            'shipping_info.fullName' => 'required|string|max:255',
            'shipping_info.email' => 'nullable|email',
            'shipping_info.phone' => 'required|string',
            'shipping_info.address' => 'required|string',
            'shipping_info.city' => 'required|string',
            'shipping_info.state' => 'required|string',
            'shipping_info.postalCode' => 'required|string',
            'shipping_info.shippingMethod' => 'required|string',
            'shipping_info.paymentMethod' => 'required|string|in:cod,card,paypal,bank,bank_transfer,transfer',
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
            // حساب الإجمالي الصحيح
            $subtotal = $request->order_summary['subtotal'];
            $shipping = $request->order_summary['shipping'] ?? 0;
            $discount = $request->order_summary['discount'] ?? 0;
            $paymentFees = $request->order_summary['payment_fees'] ?? 0;
            $tax = $request->order_summary['tax'] ?? 0;

            // حساب الإجمالي: المجموع الفرعي + الشحن + رسوم الدفع + الضريبة - الخصم
            $calculatedTotal = $subtotal + $shipping + $paymentFees + $tax - $discount;

            // استخدام الإجمالي المحسوب بدلاً من المرسل من العميل
            $finalTotal = $calculatedTotal;

            // إنشاء الطلب
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
                'invoice_code' => strtoupper('INV-' . substr(md5(uniqid((string)Auth::id(), true)), 0, 8)),
                'status' => 'pending',
                'total' => $finalTotal,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'payment_fees' => $paymentFees,
                'type' => 'online',
                'is_shipping_different' => false,
                'tax_amount' => $tax,
                'shipping_amount' => $shipping,
                'discount_amount' => $discount,
                'currency' => 'MAD',
                'shipping_cost' => $shipping,
                'total_price' => $finalTotal,

                // معلومات الشحن
                'name' => $request->shipping_info['fullName'],
                'phone' => $request->shipping_info['phone'],
                'address' => $request->shipping_info['address'],
                'city' => $request->shipping_info['city'],
                'state' => $request->shipping_info['state'],
                'zip' => $request->shipping_info['postalCode'],
                'locality' => $request->shipping_info['city'],
                'country' => 'Morocco',
                'payment_method' => $request->shipping_info['paymentMethod'],
                'total_amount' => $finalTotal,
                'shipping_name' => $request->shipping_info['fullName'],
                'shipping_email' => $request->shipping_info['email'] ?? '',
                'shipping_phone' => $request->shipping_info['phone'],
                'shipping_address' => $request->shipping_info['address'],
                'shipping_city' => $request->shipping_info['city'],
                'shipping_state' => $request->shipping_info['state'],
                'shipping_postal_code' => $request->shipping_info['postalCode'],
                'shipping_method' => $request->shipping_info['shippingMethod'],
                'payment_status' => 'pending',
            ]);

            // إضافة عناصر الطلب
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                Log::info('Product data for order item', [
                    'product_id' => $item['product_id'],
                    'product_found' => !!$product,
                    'product_price' => $product ? $product->price : 'null',
                    'product_data' => $product ? $product->toArray() : 'not found'
                ]);

                if (!$product) {
                    throw new Exception("Product with ID {$item['product_id']} not found");
                }

                $price = $product->price ?? 0;
                if ($price === null) {
                    throw new Exception("Product {$item['product_id']} has null price");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name ?? 'Unknown Product',
                    'product_sku' => $product->sku ?? 'N/A',
                    'product_image' => $product->thumbnail ?? null,
                    'product_description' => $product->description ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'total' => $price * $item['quantity'],
                    'discount_amount' => 0,
                    'tax_amount' => 0,
                ]);
            }

            // إنشاء معاملة إذا كان الدفع تحويل بنكي
            $paymentMethod = $request->shipping_info['paymentMethod'] ?? 'cod';
            $invoice = null;

            Log::info('Payment method check', [
                'payment_method' => $paymentMethod,
                'is_bank_payment' => in_array($paymentMethod, ['bank', 'bank_transfer', 'transfer'])
            ]);

            if (in_array($paymentMethod, ['bank', 'bank_transfer', 'transfer'])) {
                Log::info('Creating bank transaction and invoice');

                Transaction::create([
                    'user_id' => Auth::id(),
                    'order_id' => $order->id,
                    'mode' => 'bank',
                    'status' => 'pending',
                ]);

                // إنشاء فاتورة للدفع البنكي
                $bankSettings = Setting::whereIn('key', ['bank_name', 'bank_account_number'])->get()->keyBy('key');

                Log::info('Bank settings', [
                    'bank_name' => $bankSettings['bank_name']->value ?? 'البنك الأهلي المغربي',
                    'account_number' => $bankSettings['bank_account_number']->value ?? '1234567890123456'
                ]);

                $invoice = Invoice::create([
                    'invoice_code' => $order->invoice_code,
                    'order_id' => $order->id,
                    'amount' => $finalTotal,
                    'bank_name' => $bankSettings['bank_name']->value ?? 'البنك الأهلي المغربي',
                    'account_number' => $bankSettings['bank_account_number']->value ?? '1234567890123456',
                    'payment_reference' => Invoice::generatePaymentReference(),
                    'status' => 'pending'
                ]);

                Log::info('Invoice created', ['invoice_id' => $invoice->id, 'payment_reference' => $invoice->payment_reference]);
            }

            DB::commit();

            $responseData = [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'invoice_code' => $order->invoice_code,
                'payment_method' => $paymentMethod,
                'redirect_to_invoice' => false,
                'invoice_id' => null
            ];

            // إضافة معرف الفاتورة إذا تم إنشاؤها
            if ($invoice) {
                $responseData['invoice_id'] = $invoice->id;
                $responseData['redirect_to_invoice'] = true;
                $responseData['invoice_url'] = '/invoice/' . $invoice->id;
                Log::info('Invoice created - adding to response', [
                    'invoice_id' => $invoice->id,
                    'payment_method' => $paymentMethod,
                    'redirect_to_invoice' => true
                ]);
            } else {
                $responseData['redirect_to_invoice'] = false;
                Log::info('No invoice needed for payment method', [
                    'payment_method' => $paymentMethod,
                    'redirect_to_invoice' => false
                ]);
            }

            Log::info('Final response data being sent', $responseData);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'data' => $responseData
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('خطأ في إنشاء الطلب: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الطلب: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
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
            $order = Order::with(['orderItems.product', 'user', 'invoice'])
                ->findOrFail($id);

            // تنسيق بيانات الطلب
            $orderData = $order->toArray();

            // تحويل delivered إلى completed للتوافق مع Frontend
            if ($orderData['status'] === 'delivered') {
                $orderData['status'] = 'completed';
            }

            // إضافة معلومات إضافية للفاتورة
            if ($order->invoice) {
                $orderData['has_invoice'] = true;
                $orderData['invoice_url'] = "/invoices/" . $order->invoice->id;
                $orderData['can_upload_proof'] = $order->invoice->status === 'pending';
            } else {
                $orderData['has_invoice'] = false;
                $orderData['invoice_url'] = null;
                $orderData['can_upload_proof'] = false;
            }

            return response()->json([
                'success' => true,
                'data' => $orderData
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

    /**
     * الحصول على فاتورة الطلب
     */
    public function getOrderInvoice($id)
    {
        try {
            $order = Order::with('invoice')->findOrFail($id);

            if (!$order->invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد فاتورة لهذا الطلب'
                ], 404);
            }

            $invoiceData = $order->invoice->toArray();
            $invoiceData['payment_proof_url'] = $order->invoice->payment_proof ?
                asset('storage/' . $order->invoice->payment_proof) : null;
            $invoiceData['can_upload_proof'] = $order->invoice->status === 'pending';
            $invoiceData['order_number'] = $order->order_number;
            $invoiceData['customer_name'] = $order->name;

            return response()->json([
                'success' => true,
                'invoice' => $invoiceData
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب فاتورة الطلب: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الفاتورة'
            ], 500);
        }
    }
}
