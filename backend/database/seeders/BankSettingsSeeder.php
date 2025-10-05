<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class BankSettingsSeeder extends Seeder
{
    public function run()
    {
        $bankSettings = [
            [
                'key' => 'bank_name',
                'value' => 'البنك الأهلي المغربي',
                'type' => 'text',
                'description' => 'اسم البنك للدفع'
            ],
            [
                'key' => 'bank_account_number',
                'value' => '1234567890123456',
                'type' => 'text',
                'description' => 'رقم الحساب البنكي'
            ],
            [
                'key' => 'bank_account_holder',
                'value' => 'شركة T9DA',
                'type' => 'text',
                'description' => 'اسم صاحب الحساب'
            ]
        ];

        foreach ($bankSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}