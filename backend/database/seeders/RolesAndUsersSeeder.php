<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // إعادة تعيين الأدوار والصلاحيات المخزنة مؤقتاً
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // تنظيف البيانات القديمة
        \Illuminate\Support\Facades\DB::table('model_has_roles')->truncate();
        \Illuminate\Support\Facades\DB::table('role_has_permissions')->truncate();
        \Illuminate\Support\Facades\DB::table('model_has_permissions')->truncate();
        \Illuminate\Support\Facades\DB::table('users')->truncate();
        \Illuminate\Support\Facades\DB::table('roles')->truncate();
        \Illuminate\Support\Facades\DB::table('permissions')->truncate();

        // 1. إنشاء الأدوار لكلا الحارسين (web و sanctum)
        $adminRoleWeb = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $customerRoleWeb = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        $adminRoleSanctum = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
        $customerRoleSanctum = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'sanctum']);

        // 2. إنشاء مستخدم مدير (Admin)
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@t9da.com',
            'password' => Hash::make('password'), // استخدم كلمة مرور قوية في مشروعك الحقيقي
            'utype' => 'ADM', // ADM for Admin
        ]);
        // إسناد أدوار 'admin' للمستخدم (للحارسين web و sanctum)
        $adminUser->assignRole($adminRoleWeb);

        // إدراج دور sanctum يدوياً في جدول model_has_roles
        \Illuminate\Support\Facades\DB::table('model_has_roles')->insertOrIgnore([
            'role_id' => $adminRoleSanctum->id,
            'model_type' => 'App\Models\User',
            'model_id' => $adminUser->id,
        ]);

        // 3. إنشاء مستخدم زبون (Customer)
        $customerUser = User::create([
            'name' => 'Customer User',
            'email' => 'customer@t9da.com',
            'password' => Hash::make('password'),
            'utype' => 'USR', // USR for User or Customer
        ]);
        // إسناد أدوار 'customer' للمستخدم (للحارسين web و sanctum)
        $customerUser->assignRole($customerRoleWeb);

        // إدراج دور sanctum يدوياً في جدول model_has_roles
        \Illuminate\Support\Facades\DB::table('model_has_roles')->insertOrIgnore([
            'role_id' => $customerRoleSanctum->id,
            'model_type' => 'App\Models\User',
            'model_id' => $customerUser->id,
        ]);
    }
}
