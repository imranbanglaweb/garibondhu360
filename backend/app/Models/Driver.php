<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'license_number',
        'license_expiry',
        'nid_number',
        'address',
        'emergency_contact',
        'join_date',
        'status',
        'rating',
        'avatar',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'license_expiry' => 'date',
        'join_date' => 'date',
    ];

    // Driver Status
    const STATUS_AVAILABLE = 'available';
    const STATUS_ON_TRIP = 'on_trip';
    const STATUS_OFF_DUTY = 'off_duty';

    /**
     * Get the vehicles for this driver.
     */
    public function vehicles()
    {
        return $this->belongsToMany(Vehicle::class, 'vehicle_drivers');
    }

    /**
     * Get the requisitions for this driver.
     */
    public function requisitions()
    {
        return $this->hasMany(Requisition::class);
    }
}
