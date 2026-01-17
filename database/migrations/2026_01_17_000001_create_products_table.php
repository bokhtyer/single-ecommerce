<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('full_details')->nullable();
            
            // Pricing
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->timestamp('discount_start_date')->nullable();
            $table->timestamp('discount_end_date')->nullable();
            
            // Inventory
            $table->integer('quantity')->default(0);
            $table->integer('min_order_quantity')->default(1);
            $table->integer('max_order_quantity')->nullable();
            $table->string('sku')->unique()->nullable();
            
            // Images
            $table->string('thumbnail')->nullable();
            $table->json('gallery_images')->nullable();
            
            // Attributes & Variations
            $table->json('attributes')->nullable(); // [{name: 'Size', values: ['S', 'M', 'L']}]
            $table->json('variations')->nullable(); // [{sku: 'ABC-S', attributes: {Size: 'S'}, price: 100, quantity: 10}]
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('tags')->nullable();
            
            // Shipping
            $table->boolean('free_shipping')->default(false);
            $table->decimal('shipping_cost_dhaka', 8, 2)->nullable();
            $table->decimal('shipping_cost_outside_dhaka', 8, 2)->nullable();
            
            // Additional
            $table->boolean('is_landing_page')->default(false);
            $table->integer('views_count')->default(0);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
