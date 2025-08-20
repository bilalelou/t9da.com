<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Transaction;
use App\Models\Address;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(){
        return view('user.index');
    }

    public function orders()
    {
        $orders = Order::where('user_id', Auth::user()->id)->orderBy('created_at', 'DESC')->paginate(10);
        return view('user.orders', compact('orders'));
    }

    public function order_details($order_id){
        $order = Order::where('user_id', Auth::user()->id)->where('id',$order_id)->first();
        if($order){

            $orderItems = OrderItem::where('order_id',$order->id)->orderBy('id')->paginate(12);
            $transaction = Transaction::where('order_id',$order->id)->first();
            return view('user.order-details',compact('order','orderItems','transaction'));
        }else
        {
            return redirect()->route('login');
        }

    }

    public function order_cancel(Request $request){
        $order = Order::find($request->order_id);
        $order->status = "canceled";
        $order->canceled_date = Carbon::now();
        $order->save();

        return back()->with('status', 'Order has been cancelled successfully!');
    }

    public function user_address()
    {
        $addresses = Address::where('user_id', Auth::id())->get();
        return view('user.address', compact('addresses'));
    }

    /**
     * Show the form for creating a new address.
     */
    public function add_address()
    {
        return view('user.address-add'); // ستحتاج لإنشاء هذا الملف
    }

    /**
     * Store a newly created address in storage.
     */
    public function store_address(Request $request)
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
        $address->user_id = Auth::id();
        $address->fill($request->all());
        $address->country = 'Morocco'; // يمكنك تغييرها إذا لزم الأمر

        // Check if user wants to set this as default address
        if ($request->has('set_as_default') && $request->set_as_default) {
            // Remove default from all other addresses
            Address::where('user_id', Auth::id())->update(['isdefault' => false]);
            $address->isdefault = true;
        } else {
            $address->isdefault = false;
        }

        $address->save();

        return redirect()->route('user.address')->with('status', 'Address added successfully!');
    }

    /**
     * Set an address as the default.
     */
    public function set_default_address($id)
    {
        // 1. إزالة العلامة الافتراضية من جميع العناوين الأخرى
        Address::where('user_id', Auth::id())->update(['isdefault' => false]);

        // 2. تعيين العنوان المحدد كافتراضي
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $address->isdefault = true;
        $address->save();

        return redirect()->route('user.address')->with('status', 'Default address has been set.');
    }

    /**
     * Show the form for editing the specified address.
     */
    public function edit_address($id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        return view('user.address-edit', compact('address'));
    }

    /**
     * Update the specified address in storage.
     */
    public function update_address(Request $request, $id)
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

        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $address->fill($request->all());
        $address->country = 'Morocco'; // يمكنك تغييرها إذا لزم الأمر

        // Check if user wants to set this as default address
        if ($request->has('set_as_default') && $request->set_as_default) {
            // Remove default from all other addresses
            Address::where('user_id', Auth::id())->update(['isdefault' => false]);
            $address->isdefault = true;
        }

        $address->save();

        return redirect()->route('user.address')->with('status', 'Address updated successfully!');
    }

    /**
     * Remove the specified address from storage.
     */
    public function delete_address($id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $address->delete();

        return redirect()->route('user.address')->with('status', 'Address has been deleted.');
    }

     public function account_details()
    {
        $user = Auth::user();
        return view('user.account-details', compact('user'));
    }

    /**
     * Update the user's profile information.
     */
    public function update_profile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return redirect()->back()->with('profile_status', 'Profile has been updated successfully!');
    }

    /**
     * Update the user's password.
     */
    public function update_password(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return redirect()->back()->with('password_error', 'Current password does not match!');
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return redirect()->back()->with('password_status', 'Password has been changed successfully!');
    }

}
