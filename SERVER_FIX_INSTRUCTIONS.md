# خطوات تطبيق الإصلاحات في الخادم

## 1. سحب التحديثات
```bash
git pull origin main
```

## 2. إنشاء الأدوار المطلوبة للحارس sanctum
```bash
php artisan tinker --execute="
use Spatie\Permission\Models\Role;
Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'sanctum']);
echo 'Roles created for sanctum guard';
"
```

## 3. إعطاء المستخدمين الحاليين أدوار sanctum
```bash
php artisan tinker --execute="
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

\$users = User::with('roles')->get();
foreach (\$users as \$user) {
    \$webRoles = \$user->roles()->where('guard_name', 'web')->pluck('name');
    foreach (\$webRoles as \$roleName) {
        \$sanctumRole = Role::where('name', \$roleName)->where('guard_name', 'sanctum')->first();
        if (\$sanctumRole) {
            \$exists = DB::table('model_has_roles')
                ->where('role_id', \$sanctumRole->id)
                ->where('model_type', 'App\Models\User')
                ->where('model_id', \$user->id)
                ->exists();
            if (!\$exists) {
                DB::table('model_has_roles')->insert([
                    'role_id' => \$sanctumRole->id,
                    'model_type' => 'App\Models\User',
                    'model_id' => \$user->id,
                ]);
                echo 'Assigned ' . \$roleName . ' role to ' . \$user->name . ' for sanctum guard\n';
            }
        }
    }
}
echo 'Done assigning sanctum roles to existing users';
"
```

## 4. (اختياري) تشغيل الـ seeder المحدث للمستقبل
```bash
php artisan db:seed --class=RoleSeeder
```

## 5. التحقق من النتائج
```bash
php artisan tinker --execute="
echo json_encode(Spatie\Permission\Models\Role::all(['name', 'guard_name'])->toArray(), JSON_PRETTY_PRINT);
"
```

## ملاحظات مهمة:
- تأكد من عمل backup لقاعدة البيانات قبل التطبيق
- اختبر على بيئة staging أولاً إذا كان متاحاً
- إذا كان لديك مستخدمون جدد، سيتم إنشاء أدوارهم تلقائياً للحارسين عند استخدام الـ seeder المحدث