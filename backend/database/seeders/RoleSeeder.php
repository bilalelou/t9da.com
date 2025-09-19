<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['admin', 'customer'];
        $guards = ['web', 'sanctum'];

        foreach ($guards as $guard) {
            foreach ($roles as $roleName) {
                Role::firstOrCreate([
                    'name' => $roleName,
                    'guard_name' => $guard,
                ]);
            }
        }

        $this->command->info('Roles created successfully for both web and sanctum guards.');
    }
}
