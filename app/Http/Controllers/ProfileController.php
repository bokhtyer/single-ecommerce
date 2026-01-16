<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show()
    {
        return Inertia::render('Customer/Profile');
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:50'],
            'email' => [
                'required', 
                'email', 
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'phone' => ['nullable', 'string', 'regex:/^[0-9+\s\-()]*$/', 'min:10'],
            'address' => ['nullable', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        // Convert empty strings to null for nullable fields
        foreach (['phone', 'address', 'city', 'postal_code'] as $field) {
            if (isset($validated[$field]) && trim($validated[$field]) === '') {
                $validated[$field] = null;
            }
        }

        // Check if email changed and user is verified
        if ($user->email !== $validated['email'] && $user->is_verified) {
            // If email changes, you might want to require re-verification
            // For now, we'll keep the user verified
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}
