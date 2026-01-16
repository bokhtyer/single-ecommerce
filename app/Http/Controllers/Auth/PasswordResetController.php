<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    /**
     * Show forgot password form
     */
    public function showForgotForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Send password reset OTP
     */
    public function sendResetOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if user is verified
        $user = User::where('email', $request->email)->first();
        
        if (!$user->is_verified) {
            return back()->withErrors([
                'email' => 'Your account is not verified. Please verify your email first.',
            ])->withInput();
        }

        // Delete old OTPs and generate new one
        OtpVerification::deleteOldOtps($request->email, 'password_reset');
        OtpVerification::generateOtp($request->email, 'password_reset');

        return redirect()->route('password.verify.show', ['email' => $request->email])
            ->with('success', 'OTP has been sent to your email.');
    }

    /**
     * Show OTP verification form for password reset
     */
    public function showVerifyForm(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return redirect()->route('password.forgot');
        }

        return Inertia::render('Auth/VerifyPasswordOtp', [
            'email' => $email,
        ]);
    }

    /**
     * Verify OTP and show reset form
     */
    public function verifyOtp(Request $request)
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
            'password_reset'
        );

        if (!$isValid) {
            return back()->withErrors([
                'otp' => 'Invalid or expired OTP. Please try again.',
            ])->withInput();
        }

        return redirect()->route('password.reset.show', [
            'email' => $request->email,
            'otp' => $request->otp,
        ]);
    }

    /**
     * Show reset password form
     */
    public function showResetForm(Request $request)
    {
        $email = $request->query('email');
        $otp = $request->query('otp');
        
        if (!$email || !$otp) {
            return redirect()->route('password.forgot');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'otp' => $otp,
        ]);
    }

    /**
     * Reset password
     */
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput($request->except('password', 'password_confirmation'));
        }

        // Find user and update password
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);

            return redirect()->route('login')
                ->with('success', 'Password has been reset successfully. Please login with your new password.');
        }

        return back()->withErrors([
            'email' => 'User not found.',
        ])->withInput($request->except('password', 'password_confirmation'));
    }

    /**
     * Resend password reset OTP
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Delete old OTPs and generate new one
        OtpVerification::deleteOldOtps($request->email, 'password_reset');
        OtpVerification::generateOtp($request->email, 'password_reset');

        return back()->with('success', 'New OTP has been sent to your email.');
    }
}
