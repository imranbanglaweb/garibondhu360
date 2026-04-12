<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Webhook extends Model
{
    protected $fillable = [
        'url',
        'secret',
        'event',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    const EVENT_USER_REGISTERED = 'user.registered';
    const EVENT_SUBSCRIPTION_ACTIVATED = 'subscription.activated';
    const EVENT_PAYMENT_VERIFIED = 'payment.verified';

    const EVENTS = [
        self::EVENT_USER_REGISTERED => 'User Registered',
        self::EVENT_SUBSCRIPTION_ACTIVATED => 'Subscription Activated',
        self::EVENT_PAYMENT_VERIFIED => 'Payment Verified',
    ];
}