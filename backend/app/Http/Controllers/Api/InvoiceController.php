<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255'
        ]);

        $order = Order::findOrFail($request->order_id);

        $invoice = Invoice::create([
            'invoice_code' => Invoice::generateInvoiceCode(),
            'order_id' => $order->id,
            'amount' => $order->total_amount,
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'invoice' => $invoice->load('order')
        ]);
    }

    public function uploadProof(Request $request, Invoice $invoice)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($invoice->payment_proof) {
            Storage::disk('public')->delete($invoice->payment_proof);
        }

        $path = $request->file('payment_proof')->store('invoices', 'public');
        
        $invoice->update(['payment_proof' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع إثبات الدفع بنجاح',
            'invoice' => $invoice
        ]);
    }

    public function show(Invoice $invoice)
    {
        $invoiceData = $invoice->load(['order.user', 'order.orderItems.product'])->toArray();
        
        // إضافة معلومات إضافية
        $invoiceData['payment_proof_url'] = $invoice->payment_proof ? 
            asset('storage/' . $invoice->payment_proof) : null;
        $invoiceData['can_upload_proof'] = $invoice->status === 'pending';
        $invoiceData['is_paid'] = $invoice->status === 'paid';
        $invoiceData['is_rejected'] = $invoice->status === 'rejected';
        
        return response()->json([
            'success' => true,
            'invoice' => $invoiceData
        ]);
    }

    public function index(Request $request)
    {
        $invoices = Invoice::with('order')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'invoices' => $invoices
        ]);
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,rejected',
            'admin_notes' => 'nullable|string'
        ]);

        $invoice->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        if ($request->status === 'paid') {
            $invoice->order->update(['payment_status' => 'paid']);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الفاتورة',
            'invoice' => $invoice->load('order')
        ]);
    }
}