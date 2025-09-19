<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Notification::with(['user:id,name,email', 'order:id,total,status'])
                ->orderBy('created_at', 'desc');

            // فلترة حسب الحالة
            if ($request->has('status')) {
                if ($request->status === 'unread') {
                    $query->unread();
                } elseif ($request->status === 'read') {
                    $query->read();
                }
            }

            // فلترة حسب النوع
            if ($request->has('type') && $request->type !== 'all') {
                $query->byType($request->type);
            }

            // فلترة حسب الأولوية
            if ($request->has('priority') && $request->priority !== 'all') {
                $query->byPriority($request->priority);
            }

            // فلترة حسب التاريخ
            if ($request->has('date_range')) {
                switch ($request->date_range) {
                    case 'today':
                        $query->whereDate('created_at', Carbon::today());
                        break;
                    case 'week':
                        $query->where('created_at', '>=', Carbon::now()->subWeek());
                        break;
                    case 'month':
                        $query->where('created_at', '>=', Carbon::now()->subMonth());
                        break;
                    case 'custom':
                        if ($request->has('start_date') && $request->has('end_date')) {
                            $query->whereBetween('created_at', [
                                Carbon::parse($request->start_date)->startOfDay(),
                                Carbon::parse($request->end_date)->endOfDay()
                            ]);
                        }
                        break;
                }
            }

            // البحث
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('message', 'like', "%{$search}%");
                });
            }

            $notifications = $query->paginate($request->get('per_page', 15));

            // إحصائيات
            $stats = [
                'total' => Notification::count(),
                'unread' => Notification::unread()->count(),
                'today' => Notification::whereDate('created_at', Carbon::today())->count(),
                'urgent' => Notification::byPriority('urgent')->unread()->count(),
                'by_type' => Notification::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type')
                    ->toArray()
            ];

            return response()->json([
                'notifications' => $notifications,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في جلب الإشعارات',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,success,warning,error,order,user,product',
            'priority' => 'required|in:low,medium,high,urgent',
            'user_id' => 'nullable|exists:users,id',
            'order_id' => 'nullable|exists:orders,id',
            'action_url' => 'nullable|string|max:255',
            'data' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $notification = Notification::create($request->all());

            return response()->json([
                'message' => 'تم إنشاء الإشعار بنجاح',
                'notification' => $notification->load(['user:id,name,email', 'order:id,total,status'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في إنشاء الإشعار',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $notification = Notification::with(['user', 'order'])->findOrFail($id);

            return response()->json([
                'notification' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'الإشعار غير موجود',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'message' => 'string',
            'type' => 'in:info,success,warning,error,order,user,product',
            'priority' => 'in:low,medium,high,urgent',
            'user_id' => 'nullable|exists:users,id',
            'order_id' => 'nullable|exists:orders,id',
            'action_url' => 'nullable|string|max:255',
            'data' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $notification = Notification::findOrFail($id);
            $notification->update($request->all());

            return response()->json([
                'message' => 'تم تحديث الإشعار بنجاح',
                'notification' => $notification->load(['user:id,name,email', 'order:id,total,status'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في تحديث الإشعار',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->delete();

            return response()->json([
                'message' => 'تم حذف الإشعار بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في حذف الإشعار',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد إشعار كمقروء
     */
    public function markAsRead(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->markAsRead();

            return response()->json([
                'message' => 'تم تحديد الإشعار كمقروء'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في تحديث الإشعار',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد إشعار كغير مقروء
     */
    public function markAsUnread(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->markAsUnread();

            return response()->json([
                'message' => 'تم تحديد الإشعار كغير مقروء'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في تحديث الإشعار',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد جميع الإشعارات كمقروءة
     */
    public function markAllAsRead()
    {
        try {
            $count = Notification::unread()->update([
                'is_read' => true,
                'read_at' => Carbon::now()
            ]);

            return response()->json([
                'message' => "تم تحديد {$count} إشعار كمقروء"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في تحديث الإشعارات',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف جميع الإشعارات المقروءة
     */
    public function deleteRead()
    {
        try {
            $count = Notification::read()->count();
            Notification::read()->delete();

            return response()->json([
                'message' => "تم حذف {$count} إشعار مقروء"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في حذف الإشعارات',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب الإشعارات الحديثة للـ header
     */
    public function recent()
    {
        try {
            $notifications = Notification::with(['user:id,name', 'order:id,total'])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            $unreadCount = Notification::unread()->count();

            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ في جلب الإشعارات',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
