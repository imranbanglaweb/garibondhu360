<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisition extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'vehicle_id',
        'driver_id',
        'requisition_number',
        'department',
        'purpose',
        'pickup_location',
        'destination',
        'travel_date',
        'return_date',
        'passengers',
        'status',
        'department_head_approved_by',
        'department_head_approved_at',
        'transport_admin_approved_by',
        'transport_admin_approved_at',
        'rejected_by',
        'rejected_at',
        'rejection_reason',
        'trip_start_mileage',
        'trip_end_mileage',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'travel_date' => 'date',
        'return_date' => 'date',
        'department_head_approved_at' => 'datetime',
        'transport_admin_approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    // Requisition Status
    const STATUS_PENDING = 'pending';
    const STATUS_DEPARTMENT_HEAD_APPROVED = 'department_head_approved';
    const STATUS_TRANSPORT_ADMIN_APPROVED = 'transport_admin_approved';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Get the user that owns the requisition.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle associated with the requisition.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the driver associated with the requisition.
     */
    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * Generate requisition number.
     */
    public static function generateRequisitionNumber()
    {
        $lastRequisition = self::orderBy('id', 'desc')->first();
        $number = $lastRequisition ? intval(substr($lastRequisition->requisition_number, 4)) + 1 : 1;
        return 'REQ-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}
