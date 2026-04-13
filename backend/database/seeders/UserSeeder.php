<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@garibondhu360.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@garibondhu360.com',
                'cell_phone' => '01500000001',
                'password' => bcrypt('admin123'),
                'role' => User::ROLE_ADMIN,
                'department' => 'IT',
                'designation' => 'System Administrator',
            ]
        );

        User::updateOrCreate(
            ['email' => 'transport@garibondhu360.com'],
            [
                'name' => 'Transport Admin',
                'email' => 'transport@garibondhu360.com',
                'cell_phone' => '01500000002',
                'password' => bcrypt('transport123'),
                'role' => User::ROLE_TRANSPORT_ADMIN,
                'department' => 'Transport',
                'designation' => 'Transport Manager',
            ]
        );
    }
}