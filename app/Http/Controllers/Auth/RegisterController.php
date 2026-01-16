<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Show registration form
     */
    public function showRegistrationForm()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration request
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if user already exists but not verified
        $existingUser = User::where('email', $request->email)
            ->where('is_verified', false)
            ->first();

        if ($existingUser) {
            // Delete old OTPs and generate new one
            OtpVerification::deleteOldOtps($request->email, 'registration');
            OtpVerification::generateOtp($request->email, 'registration');

            return redirect()->route('verify.otp.show', ['email' => $request->email])
                ->with('success', 'OTP has been resent to your email.');
        }

        // Create new user (not verified yet)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'customer',
            'is_verified' => false,
        ]);

        // Generate and send OTP
        OtpVerification::generateOtp($request->email, 'registration');

        return redirect()->route('verify.otp.show', ['email' => $request->email])
            ->with('success', 'Registration successful! Please check your email for OTP verification.');
    }
}
