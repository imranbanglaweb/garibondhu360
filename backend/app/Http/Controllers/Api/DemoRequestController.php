<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemoRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DemoRequestController extends Controller
{
    /**
     * Store a newly created demo request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'required|regex:/^01[3-9]\d{8}$/u',
            'company' => 'required|string|min:2|max:255',
            'vehicles' => 'required|string',
            'drivers' => 'required|string',
        ], [
            'name.required' => 'নাম আবশ্যক',
            'name.min' => 'নাম কমপক্ষে ২ অক্ষরের হতে হবে',
            'email.required' => 'ইমেইল আবশ্যক',
            'email.email' => 'সঠিক ইমেইল ঠিকানা দিন',
            'phone.required' => 'ফোন নম্বর আবশ্যক',
            'phone.regex' => 'সঠিক বাংলাদেশি ফোন নম্বর দিন (০১XXXXXXXXX)',
            'company.required' => 'কোম্পানির নাম আবশ্যক',
            'company.min' => 'কোম্পানির নাম কমপক্ষে ২ অক্ষরের হতে হবে',
            'vehicles.required' => 'গাড়ির সংখ্যা নির্বাচন করুন',
            'drivers.required' => 'চালকের সংখ্যা নির্বাচন করুন',
        ]);

        $demoRequest = DemoRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
            'vehicles' => $validated['vehicles'],
            'drivers' => $validated['drivers'],
            'status' => DemoRequest::STATUS_NEW,
        ]);

        return response()->json([
            'message' => 'আপনার ডেমো অনুরোধ গ্রহণ করা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব!',
            'demo_request' => $demoRequest,
        ], 201);
    }

    /**
     * Display a listing of demo requests (admin only).
     */
    public function index(Request $request)
    {
        $demoRequests = DemoRequest::orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($demoRequests);
    }

    /**
     * Display the specified demo request.
     */
    public function show(DemoRequest $demoRequest)
    {
        return response()->json($demoRequest);
    }

    /**
     * Update the specified demo request status.
     */
    public function updateStatus(Request $request, DemoRequest $demoRequest)
    {
        $request->validate([
            'status' => ['required', Rule::in([
                DemoRequest::STATUS_NEW,
                DemoRequest::STATUS_CONTACTED,
                DemoRequest::STATUS_COMPLETED,
                DemoRequest::STATUS_CANCELLED,
            ])],
        ]);

        $demoRequest->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Demo request status updated successfully',
            'demo_request' => $demoRequest,
        ]);
    }

    /**
     * Remove the specified demo request.
     */
    public function destroy(DemoRequest $demoRequest)
    {
        $demoRequest->delete();

        return response()->json([
            'message' => 'Demo request deleted successfully',
        ]);
    }
}
