<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class OtpController extends Controller
{
    /**
     * Show OTP verification form
     */
    public function showVerificationForm(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $email,
        ]);
    }

    /**
     * Verify OTP
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Verify OTP
        $isValid = OtpVerification::verifyOtp(
            $request->email,
            $request->otp,
            'registration'
        );

        if (!$isValid) {
            return back()->withErrors([
                'otp' => 'Invalid or expired OTP. Please try again.',
            ])->withInput();
        }

        // Update user verification status
        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            $user->update([
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            // Log the user in
            Auth::login($user);

            return redirect()->route('home')->with('success', 'Email verified successfully! Welcome to our store.');
        }

        return back()->withErrors([
            'email' => 'User not found.',
        ])->withInput();
    }

    /**
     * Resend OTP
     */
    public function resend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if user is already verified
        $user = User::where('email', $request->email)->first();
        
        if ($user && $user->is_verified) {
            return back()->withErrors([
                'email' => 'This email is already verified.',
            ]);
        }

        // Delete old OTPs and generate new one
        OtpVerification::deleteOldOtps($request->email, 'registration');
        OtpVerification::generateOtp($request->email, 'registration');

        return back()->with('success', 'New OTP has been sent to your email.');
    }
}
