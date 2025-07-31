<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema; // تم استيراد كلاس Schema
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // تعطيل قيود المفتاح الخارجي مؤقتاً
        Schema::disableForeignKeyConstraints();

        // حذف البيانات القديمة من الجداول لتجنب التكرار
        DB::table('orders')->truncate(); // حذف الطلبات القديمة أولاً
        DB::table('users')->truncate();  // الآن يمكن حذف المستخدمين بأمان

        // إعادة تفعيل قيود المفتاح الخارجي
        Schema::enableForeignKeyConstraints();

        // إضافة المستخدم الأول: المدير
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'mobile' => '0600000001', // يمكنك تغييره
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // كلمة المرور الافتراضية هي 'password'
            'utype' => 'ADM', // نوع المستخدم: مدير
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // إضافة المستخدم الثاني: زبون
        DB::table('users')->insert([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'mobile' => '0600000002', // يمكنك تغييره
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // كلمة المرور الافتراضية هي 'password'
            'utype' => 'USR', // نوع المستخدم: زبون
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
