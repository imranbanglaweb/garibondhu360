<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Starter',
                'name_bn' => 'স্টার্টার',
                'description' => 'Perfect for small businesses starting with fleet management',
                'description_bn' => 'ছোট ব্যবসার জন্য উপযুক্ত',
                'price' => 1000,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 2,
                'driver_limit' => 5,
                'is_active' => true,
                'features' => json_encode([
                    '2 Vehicles',
                    '5 Drivers',
                    'Basic Reports',
                    'Email Support',
                ]),
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'name_bn' => 'বেসিক',
                'description' => 'Suitable for growing businesses',
                'description_bn' => 'বর্ধিমান ব্যবসার জন্য উপযুক্ত',
                'price' => 3000,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 5,
                'driver_limit' => 10,
                'is_active' => true,
                'features' => json_encode([
                    '5 Vehicles',
                    '10 Drivers',
                    'Basic Reports',
                    'Email Support',
                ]),
                'sort_order' => 2,
            ],
            [
                'name' => 'Pro',
                'name_bn' => 'প্রো',
                'description' => 'Advanced features for established businesses',
                'description_bn' => 'প্রতিষ্ঠিত ব্যবসার জন্য উন্নত বৈশিষ্ট্য',
                'price' => 5000,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 20,
                'driver_limit' => 50,
                'is_active' => true,
                'features' => json_encode([
                    '20 Vehicles',
                    '50 Drivers',
                    'Advanced Reports',
                    'Priority Support',
                    'Multi-Approval',
                ]),
                'sort_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'name_bn' => 'এন্টারপ্রাইজ',
                'description' => 'Custom solutions for large organizations',
                'description_bn' => 'বড় সংস্থার জন্য কাস্টম সমাধান',
                'price' => 0,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 999999,
                'driver_limit' => 999999,
                'is_active' => true,
                'features' => json_encode([
                    'Unlimited Vehicles',
                    'Unlimited Drivers',
                    'Custom Reports',
                    '24/7 Support',
                    'Dedicated Manager',
                ]),
                'sort_order' => 4,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
