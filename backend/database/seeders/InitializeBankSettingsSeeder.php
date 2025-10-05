<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class InitializeBankSettingsSeeder extends Seeder
{
    public function run()
    {
        $bankSettings = [
            [
                'key' => 'bank_name',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'اسم البنك للتحويل البنكي'
            ],
            [
                'key' => 'bank_account_number',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'رقم الحساب البنكي'
            ],
            [
                'key' => 'bank_account_holder',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'اسم صاحب الحساب البنكي'
            ]
        ];

        foreach ($bankSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
        
        echo "تم تهيئة إعدادات البنك بنجاح\n";
    }
}