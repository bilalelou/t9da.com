<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Surfsidemedia\Shoppingcart\Facades\Cart;

class CartController extends Controller
{

    public function index()
    {
        $cartItems = Cart::instance('cart')->content();
        return view('cart',compact('cartItems'));
    }
    public function addToCart(Request $request)
    {
        Cart::instance('cart')->add($request->id,$request->name,$request->quantity,$request->price)->associate('App\Models\Product');
        return redirect()->back();
    }

    public function increase_item_quantity($rowId)
    {
        $product = Cart::instance('cart')->get($rowId);
        $qty = $product->qty + 1;
        Cart::instance('cart')->update($rowId,$qty);
        return redirect()->back();
    }
    public function reduce_item_quantity($rowId){
        $product = Cart::instance('cart')->get($rowId);
        $qty = $product->qty - 1;
        Cart::instance('cart')->update($rowId,$qty);
        return redirect()->back();
    }

    public function remove_item_from_cart($rowId)
    {
        Cart::instance('cart')->remove($rowId);
        return redirect()->back();
    }

    public function empty_cart()
    {
        Cart::instance('cart')->destroy();
        return redirect()->back();
    }

    public function apply_coupon_code(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required'
        ]);


        $coupon = Coupon::where('code', $request->coupon_code)
            ->where('expiry_date', '>=', now()) // now() هي اختصار لـ Carbon::now()
            ->where('cart_value', '<=', Cart::instance('cart')->subtotal())
            ->first();

        // 3. تحقق واش لقيتي الكوبون ولا لا
        if ($coupon) {
            // إلا لقيتيه، حطو فـ Session
            Session::put('coupon', [
                'code'       => $coupon->code,
                'type'       => $coupon->type,
                'value'      => $coupon->value,
                'cart_value' => $coupon->cart_value,
            ]);

            $this->calculateDiscount();

            // رجع برسالة ديال النجاح
            // لاحظ أني استعملت 'success' باش تبان بالأخضر كيف داير فالـ view
            return redirect()->back()->with('success', 'Coupon code applied successfully!');
        } else {
            // إلا ملقيتيهش، رجع برسالة ديال الخطأ
            return redirect()->back()->with('error', 'Invalid or expired coupon code!');
        }
    }
    public function remove_coupon()
    {
        if (Session::has('coupon')) {
            Session::forget('coupon');
            Session::forget('checkout'); // تأكد من حذف بيانات الخصم أيضاً
        }
        return redirect()->back()->with('success', 'Coupon has been removed successfully!');
    }
    public function calculateDiscount()
    {
        if (Session::has('coupon')) {
            $coupon = Session::get('coupon');
            $subtotal = floatval(str_replace(',', '', Cart::instance('cart')->subtotal()));

            $discount = 0;
            if ($coupon['type'] == 'fixed') {
                $discount = floatval($coupon['value']);
            } else {
                $discount = ($subtotal * floatval($coupon['value'])) / 100;
            }

            if ($discount > $subtotal) {
                $discount = $subtotal;
            }

            $subtotalAfterDiscount = $subtotal - $discount;
            $taxAfterDiscount = ($subtotalAfterDiscount * config('cart.tax')) / 100;
            $totalAfterDiscount = $subtotalAfterDiscount + $taxAfterDiscount;

            Session::put('checkout', [
                'discount' => number_format($discount, 2, '.', ''),
                'subtotal' => number_format($subtotalAfterDiscount, 2, '.', ''),
                'tax' => number_format($taxAfterDiscount, 2, '.', ''),
                'total' => number_format($totalAfterDiscount, 2, '.', '')
            ]);
        }
    }

    public function checkout()
    {
        if(!Auth::check())
        {
            return redirect()->route('login');
        }

        $address = Address::where('user_id', Auth::user()->id)->where('isdefault', 1)->first();
        return view('checkout', compact('address'));
    }

    public function place_an_order(Request $request)
    {
        $user = Auth::user();
        $address = Address::where('user_id', $user->id)->where('isdefault', true)->first();

        // إذا لم يكن هناك عنوان محفوظ، قم بالتحقق من البيانات وإنشاء عنوان جديد
        if(!$address)
        {
            $request->validate([
                'name' => 'required|max:100',
                'phone' => 'required|numeric|digits:10',
                'zip' => 'required|numeric|digits:6',
                'state' => 'required',
                'city' => 'required',
                'address' => 'required',
                'locality' => 'required',
                'landmark' => 'required',
            ]);

            $address = new Address();
            $address->user_id = $user->id;
            $address->fill($request->all()); // تعبئة البيانات تلقائياً
            $address->country = 'Morocco';
            $address->isdefault = true;
            $address->save();
        }

        // إنشاء الطلب
        $order = new Order();
        $order->user_id = $user->id;

        if (Session::has('checkout')) {
            $order->subtotal = Session::get('checkout')['subtotal'];
            $order->discount = Session::get('checkout')['discount'];
            $order->tax = Session::get('checkout')['tax'];
            $order->total = Session::get('checkout')['total'];
        } else {
            $order->subtotal = Cart::instance('cart')->subtotal(2, '.', '');
            $order->discount = 0;
            $order->tax = Cart::instance('cart')->tax(2, '.', '');
            $order->total = Cart::instance('cart')->total(2, '.', '');
        }

        // =======================================================
        // تم إصلاح هذا الجزء بإضافة جميع الحقول من جدول الطلبات
        // =======================================================
        $order->name = $address->name;
        $order->phone = $address->phone;
        $order->address = $address->address;
        $order->city = $address->city;
        $order->state = $address->state;
        $order->zip = $address->zip;
        $order->locality = $address->locality;
        $order->landmark = $address->landmark;
        $order->country = $address->country;
        $order->status = 'ordered';
        $order->is_shipping_different = false; // <-- تم إضافة الحقل الناقص
        $order->type = 'cod';                  // <-- تم إضافة الحقل الناقص
        $order->save();

        // إضافة المنتجات للطلب
        foreach(Cart::instance('cart')->content() as $item) {
            $orderitem = new OrderItem();
            $orderitem->product_id = $item->id;
            $orderitem->order_id = $order->id;
            $orderitem->price = $item->price;
            $orderitem->quantity = $item->qty;
            $orderitem->save();
        }

        // إنشاء معاملة الدفع
        $transaction = new Transaction();
        $transaction->user_id = $user->id;
        $transaction->order_id = $order->id;
        $transaction->mode = $request->mode;
        $transaction->status = "pending";
        $transaction->save();

        // مسح السلة والجلسات
        Cart::instance('cart')->destroy();
        Session::forget(['coupon', 'checkout']);
        Session::put('order_id', $order->id);

        return redirect()->route('cart.confirmation');
    }


    public function setAmountForCheckout()
    {
        if(!Cart::instance('cart')->content()->count() > 0)
        {
            Session::forget('checkout');
            return;
        }

        if(Session::has('coupon'))
        {
            Session::put('checkout', [
                'discount' => Session::get('discounts')['discount'],
                'subtotal' => Session::get('discounts')['subtotal'],
                'tax' => Session::get('discounts')['tax'],
                'total' => Session::get('discounts')['total']
            ]);
        }
        else
        {
            Session::put('checkout', [
                'discount' => 0,
                'subtotal' => Cart::instance('cart')->subtotal(),
                'tax' => Cart::instance('cart')->tax(),
                'total' => Cart::instance('cart')->total()
            ]);
        }
    }

    public function confirmation()
    {
        if(!Session::has('order_id')) {
            return redirect()->route('cart.index');
        }

        $order_id = Session::get('order_id');
        Session::forget('order_id');

        $order = Order::findOrFail($order_id);
        $transaction = Transaction::where('order_id', $order_id)->first();

        return view('order-confirmation', compact('order', 'transaction'));
    }
}
