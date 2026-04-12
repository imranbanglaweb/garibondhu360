<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Services\WebhookService;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'payment_method',
        'transaction_id',
        'sender_number',
        'amount',
        'status',
        'notes',
        'customer_name',
        'customer_email',
        'customer_phone',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Payment methods
    const METHOD_BKASH = 'bkash';
    const METHOD_ROCKET = 'rocket';
    const METHOD_NAGAD = 'nagad';

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_VERIFIED = 'verified';
    const STATUS_REJECTED = 'rejected';

    /**
     * Get the user that owns the payment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription that owns the payment.
     */
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Get the payment method display name.
     */
    public function getMethodNameAttribute()
    {
        return match($this->payment_method) {
            self::METHOD_BKASH => 'bKash',
            self::METHOD_ROCKET => 'Rocket',
            self::METHOD_NAGAD => 'Nagad',
            default => ucfirst($this->payment_method),
        };
    }

    /**
     * Verify the payment.
     */
    public function verify()
    {
        $this->status = self::STATUS_VERIFIED;
        $this->save();

        // Activate the subscription if exists
        if ($this->subscription) {
            $this->subscription = $this->subscription->activate();
            $this->subscription->load('package');
            
            // Sync to external app - subscription activated
            try {
                $webhookService = app(WebhookService::class);
                $webhookService->syncSubscriptionActivated($this->subscription);
            } catch (\Exception $e) {
                // Log but don't break the flow
                \Illuminate\Support\Facades\Log::error('Webhook sync failed: ' . $e->getMessage());
            }
        }
        
        // Sync to external app - payment verified
        try {
            $webhookService = app(WebhookService::class);
            $webhookService->syncPaymentVerified($this);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Webhook sync failed: ' . $e->getMessage());
        }
    }

    /**
     * Reject the payment.
     */
    public function reject($notes = null)
    {
        $this->status = self::STATUS_REJECTED;
        if ($notes) {
            $this->notes = $notes;
        }
        $this->save();
    }
}
