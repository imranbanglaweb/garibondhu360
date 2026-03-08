<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_bn',
        'description',
        'description_bn',
        'price',
        'billing_cycle',
        'vehicle_limit',
        'driver_limit',
        'is_active',
        'features',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'vehicle_limit' => 'integer',
        'driver_limit' => 'integer',
        'is_active' => 'boolean',
        'features' => 'array',
        'sort_order' => 'integer',
    ];

    /**
     * Get the subscriptions for this package.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Scope to get active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
