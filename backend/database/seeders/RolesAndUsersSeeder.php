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

        // 1. إنشاء الأدوار
        $adminRole = Role::create(['name' => 'admin']);
        $customerRole = Role::create(['name' => 'customer']);

        // 2. إنشاء مستخدم مدير (Admin)
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@t9da.com',
            'password' => Hash::make('password'), // استخدم كلمة مرور قوية في مشروعك الحقيقي
            'utype' => 'ADM', // ADM for Admin
        ]);
        // إسناد دور 'admin' للمستخدم
        $adminUser->assignRole($adminRole);

        // 3. إنشاء مستخدم زبون (Customer)
        $customerUser = User::create([
            'name' => 'Customer User',
            'email' => 'customer@t9da.com',
            'password' => Hash::make('password'),
            'utype' => 'USR', // USR for User or Customer
        ]);
        // إسناد دور 'customer' للمستخدم
        $customerUser->assignRole($customerRole);
    }
}
