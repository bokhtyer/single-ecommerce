<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\OtpVerification;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled task to delete expired OTPs every hour
Schedule::call(function () {
    $deleted = OtpVerification::deleteExpiredOtps();
    info("Deleted {$deleted} expired OTP(s)");
})->hourly();
