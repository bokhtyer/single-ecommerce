<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

// Public Routes
Route::get('/', [ProductController::class, 'index'])->name('home');

// Guest Routes (Authentication)
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);

    // Login
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);

    // OTP Verification
    Route::get('/verify-otp', [OtpController::class, 'showVerificationForm'])->name('verify.otp.show');
    Route::post('/verify-otp', [OtpController::class, 'verify'])->name('verify.otp');
    Route::post('/resend-otp', [OtpController::class, 'resend'])->name('resend.otp');

    // Password Reset
    Route::get('/forgot-password', [PasswordResetController::class, 'showForgotForm'])->name('password.forgot');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetOtp']);
    Route::get('/verify-password-otp', [PasswordResetController::class, 'showVerifyForm'])->name('password.verify.show');
    Route::post('/verify-password-otp', [PasswordResetController::class, 'verifyOtp'])->name('password.verify');
    Route::get('/reset-password', [PasswordResetController::class, 'showResetForm'])->name('password.reset.show');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('/resend-password-otp', [PasswordResetController::class, 'resendOtp'])->name('password.resend.otp');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Admin Routes
    Route::middleware('can:isAdmin,App\Models\User')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return inertia('Admin/Dashboard');
        })->name('dashboard');
        
        // Product Management Routes
        Route::resource('products', AdminProductController::class);
        Route::delete('/products/{product}/gallery/{index}', [AdminProductController::class, 'deleteGalleryImage'])
            ->name('products.gallery.delete');
    });

    // Customer Routes
    Route::middleware('can:isCustomer,App\Models\User')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('customer.profile');
        Route::put('/profile', [ProfileController::class, 'update'])->name('customer.profile.update');

        Route::get('/orders', function () {
            return inertia('Customer/Orders');
        })->name('customer.orders');
    });
});
