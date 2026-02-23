<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'department',
        'designation',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Roles
    const ROLE_ADMIN = 'admin';
    const ROLE_TRANSPORT_ADMIN = 'transport_admin';
    const ROLE_DEPARTMENT_HEAD = 'department_head';
    const ROLE_EMPLOYEE = 'employee';
    const ROLE_DRIVER = 'driver';

    /**
     * Get the requisitions for this user.
     */
    public function requisitions()
    {
        return $this->hasMany(Requisition::class, 'user_id');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin()
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_TRANSPORT_ADMIN]);
    }
}
