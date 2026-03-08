<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255|regex:/^[a-zA-Z\s]+$/u',
            'email' => 'required|string|email:rfc,dns|max:255|unique:users',
            'phone' => 'required|regex:/^01[3-9]\d{8}$/u|unique:users',
            'password' => 'required|string|min:6|confirmed|regex:/^(?=.*[a-zA-Z])(?=.*\d).+$/u',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
        ], [
            'name.required' => 'নাম আবশ্যক',
            'name.min' => 'নাম কমপক্ষে ২ অক্ষরের হতে হবে',
            'name.regex' => 'নামে শুধুমাত্র অক্ষর এবং ফাঁকা জায়গা থাকতে পারে',
            'email.required' => 'ইমেইল আবশ্যক',
            'email.email' => 'সঠিক ইমেইল ঠিকানা দিন',
            'email.unique' => 'এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে',
            'phone.required' => 'ফোন নম্বর আবশ্যক',
            'phone.regex' => 'সঠিক বাংলাদেশি ফোন নম্বর দিন (০১XXXXXXXXX)',
            'phone.unique' => 'এই ফোন নম্বর ইতিমধ্যে ব্যবহৃত হয়েছে',
            'password.required' => 'পাসওয়ার্ড আবশ্যক',
            'password.min' => 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
            'password.confirmed' => 'পাসওয়ার্ড মিলেনি',
            'password.regex' => 'পাসওয়ার্ডে কমপক্ষে একটি অক্ষর এবং একটি সংখ্যা থাকতে হবে',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_EMPLOYEE,
            'department' => $validated['department'] ?? null,
            'designation' => $validated['designation'] ?? null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'রেজিস্ট্রেশন সফল হয়েছে',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'ইমেইল আবশ্যক',
            'email.email' => 'সঠিক ইমেইল ঠিকানা দিন',
            'password.required' => 'পাসওয়ার্ড আবশ্যক',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['ইমেইল বা পাসওয়ার্ড সঠিক নয়'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'লগইন সফল হয়েছে',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'লগআউট সফল হয়েছে',
        ]);
    }
}
