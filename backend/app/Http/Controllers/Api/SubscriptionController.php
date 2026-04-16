<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class SubscriptionController extends Controller
{
    /**
     * Get all active packages.
     */
    public function packages()
    {
        $packages = Package::active()->orderBy('sort_order')->get();
        return response()->json([
            'success' => true,
            'data' => $packages,
        ]);
    }

    /**
     * Get a specific package.
     */
    public function package($id)
    {
        $package = Package::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $package,
        ]);
    }

    /**
     * Create a new subscription (initiate payment).
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'user_id' => 'nullable|exists:users,id',
            'customer_name' => 'nullable|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
        ]);

        $package = Package::findOrFail($request->package_id);
        
        // Use authenticated user or explicitly provided user_id
        $user = Auth::user();
        $userId = $user ? $user->id : ($request->user_id ?? null);

        // Create subscription
        $subscription = Subscription::create([
            'user_id' => $userId,
            'package_id' => $package->id,
            'status' => Subscription::STATUS_PENDING,
            'amount' => $package->price,
            'customer_name' => $request->customer_name ?? ($user ? $user->name : null),
            'customer_email' => $request->customer_email ?? ($user ? $user->email : null),
            'customer_phone' => $request->customer_phone ?? ($user ? $user->phone : null),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription created successfully',
            'data' => [
                'subscription' => $subscription,
                'package' => $package,
            ],
        ]);
    }

    /**
     * Get user's subscriptions.
     */
    public function mySubscriptions()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => true, 'data' => []]);
        }
        $subscriptions = $user->subscriptions()->with('package')->latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $subscriptions,
        ]);
    }

    /**
     * Get user's active subscription.
     */
    public function myActiveSubscription()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => true, 'data' => null]);
        }
        $subscription = $user->subscriptions()
            ->with('package')
            ->where('status', Subscription::STATUS_ACTIVE)
            ->first();
        
        if ($subscription) {
            $subscription->start_date = $subscription->start_date;
            $subscription->end_date = $subscription->end_date;
            $subscription->expires_at = $subscription->end_date;
            $subscription->started_at = $subscription->start_date;
        }
        
        return response()->json([
            'success' => true,
            'data' => $subscription,
        ]);
    }

    /**
     * Submit payment proof (manual payment).
     */
    public function submitPayment(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'payment_method' => 'required|in:bkash,rocket,nagad',
            'transaction_id' => 'required|string',
            'sender_number' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'user_id' => 'nullable|exists:users,id',
            'customer_name' => 'nullable|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
        ]);

        $subscription = Subscription::findOrFail($request->subscription_id);

        // Verify amount matches package price
        if ($request->amount < $subscription->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Amount is less than the package price',
            ], 422);
        }

        // Use authenticated user or explicitly provided user_id
        $user = Auth::user();
        $userId = $user ? $user->id : ($request->user_id ?? null);

        // Create payment record
        $payment = Payment::create([
            'user_id' => $userId,
            'subscription_id' => $subscription->id,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'sender_number' => $request->sender_number,
            'amount' => $request->amount,
            'status' => Payment::STATUS_PENDING,
            'customer_name' => $request->customer_name ?? ($user ? $user->name : null),
            'customer_email' => $request->customer_email ?? ($user ? $user->email : null),
            'customer_phone' => $request->customer_phone ?? ($user ? $user->phone : null),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment submitted successfully. We will verify and activate your subscription shortly.',
            'data' => $payment,
        ]);
    }

    /**
     * Get user's payment history.
     */
    public function myPayments()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => true, 'data' => []]);
        }
        $payments = $user->payments()->with('subscription.package')->latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Get payment details.
     */
    public function payment($id)
    {
        $user = Auth::user();
        $payment = Payment::where('id', $id)
            ->where('user_id', $user->id)
            ->with('subscription.package')
            ->firstOrFail();
        
        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    // Admin functions

    /**
     * Get all payments (admin).
     */
    public function allPayments(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TRANSPORT_ADMIN])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payments = Payment::with(['user', 'subscription.package'])
            ->when($request->status, function($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Verify a payment (admin).
     */
    public function verifyPayment(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TRANSPORT_ADMIN])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:verified,rejected',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::findOrFail($id);
        
        if ($request->status === 'verified') {
            $payment->verify();
            
            // Refresh subscription with package
            $payment->load('subscription.package');
        } else {
            $payment->reject($request->notes);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully',
            'data' => $payment->fresh(['subscription.package']),
        ]);
    }

    /**
     * Approve a payment (admin - mark as approved without verifying).
     */
    public function approvePayment(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TRANSPORT_ADMIN])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::findOrFail($id);
        $payment->approve($request->notes);
        
        // Load subscription with package
        $payment->load('subscription.package');

        return response()->json([
            'success' => true,
            'message' => 'Payment approved successfully',
            'data' => $payment,
        ]);
    }

    /**
     * Get all subscriptions (admin).
     */
    public function allSubscriptions(Request $request)
    {
        $subscriptions = Subscription::with(['user', 'package'])
            ->when($request->status, function($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $subscriptions,
        ]);
    }
}
