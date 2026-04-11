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
                'name' => 'Free Trial',
                'name_bn' => 'ফ্রি ট্রায়াল',
                'description' => '7 Days Free Trial - Perfect for trying out our fleet management system',
                'description_bn' => '৭ দিন ফ্রি ট্রায়াল - আমাদের ফ্লিট ম্যানেজমেন্ট সিস্টেম পরীক্ষা করুন',
                'price' => 0,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 5,
                'driver_limit' => 4,
                'is_active' => true,
                'features' => json_encode([
                    'Fuel & Maintenance Management',
                    'Basic Reports',
                    'Vehicle Tracking',
                    'Driver Management',
                    'Requisition System',
                    'Up to 5 Vehicles',
                    '4 Users',
                    '7 Days Free Trial',
                ]),
                'sort_order' => 1,
            ],
            [
                'name' => 'Starter',
                'name_bn' => 'স্টার্টার',
                'description' => 'Perfect for small businesses starting with fleet management',
                'description_bn' => 'ছোট ব্যবসার জন্য উপযুক্ত',
                'price' => 999,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 5,
                'driver_limit' => 4,
                'is_active' => true,
                'features' => json_encode([
                    'Requisition Manage',
                    'Trip Manage',
                    'GPS Tracker',
                    'Email & Notification Support',
                    'Multi Language Support',
                    'Fuel & Maintenance',
                    'Basic Reports',
                    'Vehicle Tracking',
                    'Driver Management',
                    'Up to 5 Vehicles',
                    '4 Users',
                ]),
                'sort_order' => 2,
            ],
            [
                'name' => 'Business',
                'name_bn' => 'বিজনেস',
                'description' => 'Suitable for growing businesses with advanced needs',
                'description_bn' => 'বর্ধিমান ব্যবসার জন্য উন্নত সুবিধা সহ',
                'price' => 2999,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 25,
                'driver_limit' => 10,
                'is_active' => true,
                'features' => json_encode([
                    'Advanced Reports',
                    'Priority Support',
                    'Fuel & Maintenance',
                    'API Access',
                    'GPS Tracking',
                    'Trip Sheets',
                    'Maintenance Alerts',
                    'Up to 25 Vehicles',
                    '10 Users',
                ]),
                'sort_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'name_bn' => 'এন্টারপ্রাইজ',
                'description' => 'Custom solutions for large organizations - Contact for pricing',
                'description_bn' => 'বড় সংস্থার জন্য কাস্টম সমাধান - মূল্যের জন্য যোগাযোগ করুন',
                'price' => 0,
                'billing_cycle' => 'monthly',
                'vehicle_limit' => 999999,
                'driver_limit' => 999999,
                'is_active' => true,
                'features' => json_encode([
                    'Unlimited Vehicles',
                    'Unlimited Users',
                    'Unlimited Drivers',
                    'API & Integrations',
                    'Dedicated Account Manager',
                    'Custom Development',
                    '24/7 Priority Support',
                ]),
                'sort_order' => 4,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
