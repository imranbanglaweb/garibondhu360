<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255|regex:/^[a-zA-Z\s]+$/u',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'nullable|regex:/^01[3-9]\d{8}$/u',
            'subject' => 'required|string|min:5|max:255',
            'message' => 'required|string|min:10|max:5000',
        ], [
            'name.required' => 'নাম আবশ্যক',
            'name.min' => 'নাম কমপক্ষে ২ অক্ষরের হতে হবে',
            'name.regex' => 'নামে শুধুমাত্র অক্ষর এবং ফাঁকা জায়গা থাকতে পারে',
            'email.required' => 'ইমেইল আবশ্যক',
            'email.email' => 'সঠিক ইমেইল ঠিকানা দিন',
            'phone.regex' => 'সঠিক বাংলাদেশি ফোন নম্বর দিন (০১XXXXXXXXX)',
            'subject.required' => 'বিষয় আবশ্যক',
            'subject.min' => 'বিষয় কমপক্ষে ৫ অক্ষরের হতে হবে',
            'message.required' => 'মেসেজ আবশ্যক',
            'message.min' => 'মেসেজ কমপক্ষে ১০ অক্ষরের হতে হবে',
        ]);

        // Save to database
        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => Contact::STATUS_NEW,
        ]);

        // In production, you would send email
        // Mail::to('admin@garibondhu360.com')->send(new ContactMail($contact));

        return response()->json([
            'message' => 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব!',
            'contact' => $contact,
        ], 201);
    }

    /**
     * Display a listing of contact messages (admin only).
     */
    public function index(Request $request)
    {
        $contacts = Contact::orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($contacts);
    }

    /**
     * Display the specified contact message.
     */
    public function show(Contact $contact)
    {
        $contact->update(['status' => Contact::STATUS_READ]);

        return response()->json($contact);
    }

    /**
     * Update the specified contact status.
     */
    public function updateStatus(Request $request, Contact $contact)
    {
        $request->validate([
            'status' => ['required', Rule::in([
                Contact::STATUS_NEW,
                Contact::STATUS_READ,
                Contact::STATUS_REPLIED,
                Contact::STATUS_ARCHIVED,
            ])],
        ]);

        $contact->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Contact status updated successfully',
            'contact' => $contact,
        ]);
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully',
        ]);
    }
}
