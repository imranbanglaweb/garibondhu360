<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'registration_number',
        'vehicle_type',
        'brand',
        'model',
        'year',
        'color',
        'capacity',
        'fuel_type',
        'purchase_date',
        'insurance_expiry',
        'tax_token_expiry',
        'fitness_expiry',
        'status',
        'current_mileage',
        'image',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'purchase_date' => 'date',
        'insurance_expiry' => 'date',
        'tax_token_expiry' => 'date',
        'fitness_expiry' => 'date',
    ];

    // Vehicle Status
    const STATUS_AVAILABLE = 'available';
    const STATUS_IN_USE = 'in_use';
    const STATUS_MAINTENANCE = 'maintenance';
    const STATUS_OUT_OF_SERVICE = 'out_of_service';

    /**
     * Get the drivers for this vehicle.
     */
    public function drivers()
    {
        return $this->belongsToMany(Driver::class, 'vehicle_drivers');
    }

    /**
     * Get the requisitions for this vehicle.
     */
    public function requisitions()
    {
        return $this->hasMany(Requisition::class);
    }

    /**
     * Get the maintenance records for this vehicle.
     */
    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }
}
