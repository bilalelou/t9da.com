<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Exception;

class ContactController extends Controller
{
    /**
     * Handle an incoming contact form submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'البيانات المدخلة غير صالحة.', 'errors' => $validator->errors()], 422);
        }

        try {
            // [مهم] في تطبيق حقيقي، ستقوم هنا بإرسال بريد إلكتروني
            // Mail::to('admin@example.com')->send(new ContactFormMail($request->all()));

            // حالياً، سنقوم فقط بتسجيل الرسالة في سجل الخادم (log)
            Log::info('رسالة تواصل جديدة:', $request->all());

            return response()->json([
                'success' => true,
                'message' => 'شكراً لتواصلك معنا! سنقوم بالرد عليك في أقرب وقت ممكن.'
            ], 200);

        } catch (Exception $e) {
            Log::error('خطأ في إرسال رسالة التواصل: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم أثناء إرسال الرسالة.'], 500);
        }
    }
}
