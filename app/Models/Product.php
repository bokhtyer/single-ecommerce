<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'full_details',
        'price',
        'discount_price',
        'discount_start_date',
        'discount_end_date',
        'quantity',
        'min_order_quantity',
        'max_order_quantity',
        'sku',
        'thumbnail',
        'gallery_images',
        'attributes',
        'variations',
        'meta_title',
        'meta_description',
        'tags',
        'free_shipping',
        'shipping_cost_dhaka',
        'shipping_cost_outside_dhaka',
        'is_landing_page',
        'views_count',
        'is_active',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'attributes' => 'array',
        'variations' => 'array',
        'tags' => 'array',
        'free_shipping' => 'boolean',
        'is_landing_page' => 'boolean',
        'is_active' => 'boolean',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'shipping_cost_dhaka' => 'decimal:2',
        'shipping_cost_outside_dhaka' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->title);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('title') && empty($product->slug)) {
                $product->slug = Str::slug($product->title);
            }
        });
    }

    /**
     * Get the current price (considering discount).
     */
    public function getCurrentPrice()
    {
        if ($this->discount_price && $this->isDiscountActive()) {
            return $this->discount_price;
        }
        return $this->price;
    }

    /**
     * Check if discount is currently active.
     */
    public function isDiscountActive()
    {
        if (!$this->discount_price) {
            return false;
        }

        $now = now();
        
        if ($this->discount_start_date && $now->lt($this->discount_start_date)) {
            return false;
        }

        if ($this->discount_end_date && $now->gt($this->discount_end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Increment the views count.
     */
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    /**
     * Get the discount percentage.
     */
    public function getDiscountPercentage()
    {
        if ($this->discount_price && $this->price > 0) {
            return round((($this->price - $this->discount_price) / $this->price) * 100);
        }
        return 0;
    }
}
