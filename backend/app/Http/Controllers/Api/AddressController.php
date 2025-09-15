<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address; // تأكد من وجود هذا الموديل
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Auth::user()->addresses()->get();
        return response()->json(['data' => $addresses]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'type' => 'required|in:home,work,other',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // إذا كان هذا هو العنوان الافتراضي، قم بإلغاء تحديد العناوين الأخرى
        if ($data['is_default'] ?? false) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }

        $address = Auth::user()->addresses()->create($data);
        return response()->json($address, 201);
    }

    public function update(Request $request, Address $address)
    {
        // تأكد من أن المستخدم يملك هذا العنوان
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح به'], 403);
        }

        // (نفس قواعد التحقق من دالة store)
        $validator = Validator::make($request->all(), [ /* ... */ ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $data = $validator->validated();
        if ($data['is_default'] ?? false) {
            Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);
        return response()->json($address);
    }

    public function destroy(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح به'], 403);
        }

        $address->delete();
        return response()->json(null, 204);
    }
}
