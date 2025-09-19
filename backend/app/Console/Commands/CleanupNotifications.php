<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\NotificationHelper;

class CleanupNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:cleanup
                            {--days=30 : Number of days to keep read notifications}
                            {--force : Force cleanup without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old read notifications from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $force = $this->option('force');

        $this->info("🧹 بدء تنظيف الإشعارات المقروءة الأقدم من {$days} يوم...");

        if (!$force) {
            if (!$this->confirm('هل أنت متأكد من أنك تريد حذف الإشعارات المقروءة القديمة؟')) {
                $this->info('تم إلغاء العملية.');
                return Command::SUCCESS;
            }
        }

        try {
            $deletedCount = \App\Models\Notification::where('is_read', true)
                ->where('created_at', '<', now()->subDays($days))
                ->delete();

            if ($deletedCount > 0) {
                $this->info("✅ تم حذف {$deletedCount} إشعار مقروء بنجاح.");

                // إنشاء إشعار حول التنظيف
                NotificationHelper::systemInfo(
                    'تنظيف الإشعارات',
                    "تم حذف {$deletedCount} إشعار قديم من النظام (أقدم من {$days} يوم)",
                    ['deleted_count' => $deletedCount, 'days' => $days]
                );
            } else {
                $this->info("ℹ️  لا توجد إشعارات مقروءة قديمة للحذف.");
            }

            // عرض إحصائيات سريعة
            $stats = NotificationHelper::getQuickStats();
            $this->table(
                ['الإحصائية', 'العدد'],
                [
                    ['إجمالي الإشعارات', $stats['total']],
                    ['غير مقروءة', $stats['unread']],
                    ['عاجلة', $stats['urgent']],
                    ['اليوم', $stats['today']],
                ]
            );

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ حدث خطأ أثناء تنظيف الإشعارات: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
