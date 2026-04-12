<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Webhook;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;

class WebhookService
{
    /**
     * Sync user registration to external app.
     */
    public function syncUserRegistered(User $user)
    {
        $this->sendWebhook('user.registered', [
            'event' => 'user.registered',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'department' => $user->department,
                'designation' => $user->designation,
                'created_at' => $user->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Sync subscription activated to external app.
     */
    public function syncSubscriptionActivated(Subscription $subscription)
    {
        $subscription->load('package');
        
        $this->sendWebhook('subscription.activated', [
            'event' => 'subscription.activated',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'package' => [
                    'id' => $subscription->package->id ?? null,
                    'name' => $subscription->package->name ?? null,
                    'price' => $subscription->package->price ?? null,
                    'vehicle_limit' => $subscription->package->vehicle_limit ?? null,
                    'driver_limit' => $subscription->package->driver_limit ?? null,
                ],
                'status' => $subscription->status,
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
                'amount' => $subscription->amount,
            ],
        ]);
    }

    /**
     * Sync payment verified to external app.
     */
    public function syncPaymentVerified(Payment $payment)
    {
        $payment->load('subscription.package');
        
        $this->sendWebhook('payment.verified', [
            'event' => 'payment.verified',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'id' => $payment->id,
                'user_id' => $payment->user_id,
                'subscription_id' => $payment->subscription_id,
                'payment_method' => $payment->payment_method,
                'transaction_id' => $payment->transaction_id,
                'sender_number' => $payment->sender_number,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'package' => [
                    'name' => $payment->subscription?->package?->name ?? null,
                    'price' => $payment->subscription?->package?->price ?? null,
                ],
            ],
        ]);
    }

    /**
     * Send webhook to all registered URLs.
     */
    private function sendWebhook(string $event, array $payload)
    {
        // Get all active webhooks for this event type
        $webhooks = Webhook::where('event', $event)
            ->where('is_active', true)
            ->get();

        if ($webhooks->isEmpty()) {
            return;
        }

        foreach ($webhooks as $webhook) {
            $this->sendToUrl($webhook->url, $webhook->secret, $payload);
        }
    }

    /**
     * Send data to a specific URL.
     */
    private function sendToUrl(string $url, ?string $secret, array $payload)
    {
        try {
            $headers = [
                'Content-Type' => 'application/json',
                'X-Webhook-Event' => $payload['event'],
                'X-Webhook-Timestamp' => $payload['timestamp'],
            ];

            if ($secret) {
                $headers['X-Webhook-Signature'] = hash_hmac('sha256', json_encode($payload), $secret);
            }

            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->post($url, $payload);

            Log::info('Webhook sent', [
                'url' => $url,
                'event' => $payload['event'],
                'status' => $response->status(),
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Webhook failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}