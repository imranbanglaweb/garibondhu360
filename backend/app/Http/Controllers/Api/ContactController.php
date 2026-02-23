<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // In production, you would save to database and/or send email
        // Contact::create($validated);
        // Mail::to('admin@garibondhu360.com')->send(new ContactMail($validated));

        return response()->json([
            'message' => 'Your message has been sent successfully. We will contact you soon!',
        ], 201);
    }
}
