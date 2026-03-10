<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::latest()->paginate(10);
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        // Log incoming request for debugging
        \Log::info('Store Product Request', [
            'attributes_raw' => $request->input('attributes'),
            'tags_raw' => $request->input('tags'),
        ]);

        // Decode JSON strings and SAVE them separately
        $decodedAttributes = [];
        if ($request->has('attributes') && is_string($request->attributes)) {
            $decoded = json_decode($request->attributes, true);
            $decodedAttributes = is_array($decoded) ? $decoded : [];
            \Log::info('Decoded attributes', ['decoded' => $decodedAttributes]);
        }
        
        $decodedTags = [];
        if ($request->has('tags') && is_string($request->tags)) {
            $decoded = json_decode($request->tags, true);
            $decodedTags = is_array($decoded) ? $decoded : [];
        }
        
        $decodedVariations = [];
        if ($request->has('variations') && is_string($request->variations)) {
            $decoded = json_decode($request->variations, true);
            $decodedVariations = is_array($decoded) ? $decoded : [];
        }

        \Log::info('Decoded values to be saved', [
            'attributes' => $decodedAttributes,
            'tags' => $decodedTags,
        ]);

        // Convert boolean strings to actual booleans
        $request->merge([
            'free_shipping' => filter_var($request->input('free_shipping', false), FILTER_VALIDATE_BOOLEAN),
            'is_landing_page' => filter_var($request->input('is_landing_page', false), FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN),
        ]);

        // Use Validator::make - exclude JSON fields from validation
        $validator = Validator::make($request->except(['attributes', 'tags', 'variations']), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'short_description' => 'nullable|string',
            'full_details' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'quantity' => 'required|integer|min:0',
            'min_order_quantity' => 'nullable|integer|min:1',
            'max_order_quantity' => 'nullable|integer|min:1',
            'sku' => 'nullable|string|unique:products,sku',
            'thumbnail' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'free_shipping' => 'boolean',
            'shipping_cost_dhaka' => 'nullable|numeric|min:0',
            'shipping_cost_outside_dhaka' => 'nullable|numeric|min:0',
            'is_landing_page' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        // Add the decoded JSON fields directly
        $validated['attributes'] = $decodedAttributes;
        $validated['tags'] = $decodedTags;
        $validated['variations'] = $decodedVariations;

        \Log::info('After adding JSON fields to validated', [
            'attributes' => $validated['attributes'],
            'tags' => $validated['tags'],
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('products/thumbnails', 'public');
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery_images')) {
            $galleryPaths = [];
            foreach ($request->file('gallery_images') as $image) {
                $galleryPaths[] = $image->store('products/gallery', 'public');
            }
            $validated['gallery_images'] = $galleryPaths;
        }

        \Log::info('RIGHT BEFORE CREATE', [
            'validated_attributes' => $validated['attributes'],
            'validated_tags' => $validated['tags'],
        ]);

        $product = Product::create($validated);

        \Log::info('Product created', [
            'product_id' => $product->id,
            'attributes_in_db' => $product->attributes,
            'tags_in_db' => $product->tags,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        // Log incoming request for debugging
        \Log::info('Update Product Request', [
            'product_id' => $product->id,
            'attributes_raw' => $request->input('attributes'),
            'tags_raw' => $request->input('tags'),
        ]);

        // Decode JSON strings and SAVE them separately
        $decodedAttributes = [];
        if ($request->has('attributes') && is_string($request->attributes)) {
            $decoded = json_decode($request->attributes, true);
            $decodedAttributes = is_array($decoded) ? $decoded : [];
            \Log::info('Decoded attributes (update)', ['decoded' => $decodedAttributes]);
        }
        
        $decodedTags = [];
        if ($request->has('tags') && is_string($request->tags)) {
            $decoded = json_decode($request->tags, true);
            $decodedTags = is_array($decoded) ? $decoded : [];
        }
        
        $decodedVariations = [];
        if ($request->has('variations') && is_string($request->variations)) {
            $decoded = json_decode($request->variations, true);
            $decodedVariations = is_array($decoded) ? $decoded : [];
        }

        \Log::info('Decoded values to be updated', [
            'attributes' => $decodedAttributes,
            'tags' => $decodedTags,
        ]);

        // Convert boolean strings to actual booleans
        $request->merge([
            'free_shipping' => filter_var($request->input('free_shipping', false), FILTER_VALIDATE_BOOLEAN),
            'is_landing_page' => filter_var($request->input('is_landing_page', false), FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN),
        ]);

        // Use Validator::make - exclude JSON fields from validation
        $validator = Validator::make($request->except(['attributes', 'tags', 'variations']), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug,' . $product->id,
            'short_description' => 'nullable|string',
            'full_details' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'quantity' => 'required|integer|min:0',
            'min_order_quantity' => 'nullable|integer|min:1',
            'max_order_quantity' => 'nullable|integer|min:1',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'thumbnail' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'free_shipping' => 'boolean',
            'shipping_cost_dhaka' => 'nullable|numeric|min:0',
            'shipping_cost_outside_dhaka' => 'nullable|numeric|min:0',
            'is_landing_page' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        // Add the decoded JSON fields directly
        $validated['attributes'] = $decodedAttributes;
        $validated['tags'] = $decodedTags;
        $validated['variations'] = $decodedVariations;

        \Log::info('After adding JSON fields to validated (update)', [
            'attributes' => $validated['attributes'],
            'tags' => $validated['tags'],
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($product->thumbnail) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('products/thumbnails', 'public');
        }

        // Handle gallery images upload
        $existingGalleryImages = [];
        if ($request->has('existing_gallery_images')) {
            $decoded = json_decode($request->existing_gallery_images, true);
            $existingGalleryImages = is_array($decoded) ? $decoded : [];
        }

        if ($request->hasFile('gallery_images')) {
            // Keep existing images and add new ones
            $galleryPaths = $existingGalleryImages;
            
            foreach ($request->file('gallery_images') as $image) {
                $galleryPaths[] = $image->store('products/gallery', 'public');
            }
            $validated['gallery_images'] = $galleryPaths;
        } else {
            // Only keep existing images if no new images uploaded
            if (!empty($existingGalleryImages)) {
                $validated['gallery_images'] = $existingGalleryImages;
            }
        }

        // Delete removed gallery images
        if ($product->gallery_images) {
            $removedImages = array_diff($product->gallery_images, $existingGalleryImages);
            foreach ($removedImages as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->update($validated);

        \Log::info('Product updated', [
            'product_id' => $product->id,
            'attributes_in_db' => $product->fresh()->attributes,
            'tags_in_db' => $product->fresh()->tags,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Delete associated images
        if ($product->thumbnail) {
            Storage::disk('public')->delete($product->thumbnail);
        }
        
        if ($product->gallery_images) {
            foreach ($product->gallery_images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }

    /**
     * Delete a gallery image.
     */
    public function deleteGalleryImage(Request $request, Product $product)
    {
        $imageIndex = $request->input('index');
        $galleryImages = $product->gallery_images ?? [];

        if (isset($galleryImages[$imageIndex])) {
            Storage::disk('public')->delete($galleryImages[$imageIndex]);
            unset($galleryImages[$imageIndex]);
            $product->update(['gallery_images' => array_values($galleryImages)]);
        }

        return back()->with('success', 'Image deleted successfully!');
    }
}
