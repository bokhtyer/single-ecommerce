<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $product = [
            'name' => 'SuperCool Product',
            'description' => 'This is the best single product ever.',
            'price' => 99.99,
        ];

        return Inertia::render('Home', [
            'product' => $product
        ]);
    }
}
