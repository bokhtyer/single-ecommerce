<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class OtpVerification extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'type',
        'is_used',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Generate and send OTP
     */
    public static function generateOtp(string $email, string $type = 'registration'): string
    {
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        self::create([
            'email' => $email,
            'otp' => $otp,
            'type' => $type,
            'expires_at' => now()->addMinutes(30),
        ]);

        // Send OTP via email
        Mail::to($email)->send(new OtpMail($otp, $type));

        return $otp;
    }

    /**
     * Verify OTP
     */
    public static function verifyOtp(string $email, string $otp, string $type = 'registration'): bool
    {
        $otpRecord = self::where('email', $email)
            ->where('otp', $otp)
            ->where('type', $type)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if ($otpRecord) {
            $otpRecord->update(['is_used' => true]);
            return true;
        }

        return false;
    }

    /**
     * Delete old OTPs for email
     */
    public static function deleteOldOtps(string $email, string $type = 'registration'): void
    {
        self::where('email', $email)
            ->where('type', $type)
            ->where('is_used', false)
            ->delete();
    }

    /**
     * Delete all expired OTPs (for scheduled cleanup)
     */
    public static function deleteExpiredOtps(): int
    {
        return self::where('expires_at', '<', now())->delete();
    }
}
