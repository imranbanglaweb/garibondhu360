<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Webhook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebhookController extends Controller
{
    /**
     * List all webhooks.
     */
    public function index()
    {
        $webhooks = Webhook::orderBy('id', 'desc')->get();
        
        // Add example URLs for each event
        $examples = [
            Webhook::EVENT_USER_REGISTERED => [
                'example_url' => 'https://your-app.com/webhook/user',
                'example_data' => [
                    'event' => 'user.registered',
                    'data' => ['id' => 1, 'name' => 'John Doe', 'email' => 'john@test.com']
                ]
            ],
            Webhook::EVENT_SUBSCRIPTION_ACTIVATED => [
                'example_url' => 'https://your-app.com/webhook/subscription',
                'example_data' => [
                    'event' => 'subscription.activated',
                    'data' => ['id' => 1, 'user_id' => 1, 'package' => ['name' => 'Premium']]
                ]
            ],
            Webhook::EVENT_PAYMENT_VERIFIED => [
                'example_url' => 'https://your-app.com/webhook/payment',
                'example_data' => [
                    'event' => 'payment.verified',
                    'data' => ['id' => 1, 'amount' => '1500.00', 'payment_method' => 'bkash']
                ]
            ],
        ];
        
        return response()->json([
            'success' => true,
            'data' => $webhooks,
            'examples' => $examples,
        ]);
    }

    /**
     * Create a new webhook.
     */
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'secret' => 'nullable|string',
            'event' => 'required|in:' . implode(',', array_keys(Webhook::EVENTS)),
        ]);

        $webhook = Webhook::create([
            'url' => $request->url,
            'secret' => $request->secret,
            'event' => $request->event,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Webhook created successfully',
            'data' => $webhook,
        ]);
    }

    /**
     * Update a webhook.
     */
    public function update(Request $request, $id)
    {
        $webhook = Webhook::findOrFail($id);

        $request->validate([
            'url' => 'sometimes|url',
            'secret' => 'nullable|string',
            'event' => 'sometimes|in:' . implode(',', array_keys(Webhook::EVENTS)),
        ]);

        $webhook->update($request->only(['url', 'secret', 'event', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Webhook updated successfully',
            'data' => $webhook,
        ]);
    }

    /**
     * Delete a webhook.
     */
    public function destroy($id)
    {
        $webhook = Webhook::findOrFail($id);
        $webhook->delete();

        return response()->json([
            'success' => true,
            'message' => 'Webhook deleted successfully',
        ]);
    }
    
    /**
     * Test webhook - sends test data to configured URLs.
     */
    public function test(Request $request)
    {
        $request->validate([
            'event' => 'required|in:' . implode(',', array_keys(Webhook::EVENTS)),
        ]);
        
        $event = $request->event;
        $webhooks = Webhook::where('event', $event)->where('is_active', true)->get();
        
        $testData = [
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'test' => true,
                'message' => 'This is a test webhook',
                'event' => $event,
            ],
        ];
        
        $results = [];
        foreach ($webhooks as $webhook) {
            try {
                $headers = ['Content-Type' => 'application/json'];
                if ($webhook->secret) {
                    $headers['X-Webhook-Signature'] = hash_hmac('sha256', json_encode($testData), $webhook->secret);
                }
                
                $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
                    ->timeout(30)
                    ->post($webhook->url, $testData);
                
                $results[] = [
                    'url' => $webhook->url,
                    'status' => $response->status(),
                    'success' => $response->successful(),
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'url' => $webhook->url,
                    'error' => $e->getMessage(),
                ];
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Test completed',
            'results' => $results,
        ]);
    }
}