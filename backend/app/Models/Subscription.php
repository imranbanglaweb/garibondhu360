<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'package_id',
        'status',
        'amount',
        'start_date',
        'end_date',
        'customer_name',
        'customer_email',
        'customer_phone',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_ACTIVE = 'active';
    const STATUS_EXPIRED = 'expired';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Get the user that owns the subscription.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the package that owns the subscription.
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Get the payments for this subscription.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Check if subscription is active.
     */
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE && 
               $this->end_date && 
               $this->end_date->gte(now()->toDateString());
    }

    /**
     * Activate the subscription.
     */
    public function activate($startDate = null, $endDate = null)
    {
        $this->status = self::STATUS_ACTIVE;
        $this->start_date = $startDate ?? now()->toDateString();
        $this->end_date = $endDate ?? now()->addMonth()->toDateString();
        $this->save();
    }

    /**
     * Expire the subscription.
     */
    public function expire()
    {
        $this->status = self::STATUS_EXPIRED;
        $this->save();
    }
}
