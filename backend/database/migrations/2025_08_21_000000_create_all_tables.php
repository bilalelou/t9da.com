<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // --- 1. create_users_table ---
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('phone', 20)->nullable();
                $table->string('avatar')->nullable();
                $table->enum('role', ['customer', 'admin', 'super_admin'])->default('customer');
                $table->enum('status', ['active', 'inactive', 'blocked'])->default('active');
                $table->integer('loyalty_points')->default(0);
                $table->timestamp('last_login_at')->nullable();
                $table->rememberToken();
                $table->timestamps();
                $table->softDeletes();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone', 20)->nullable();
                }
                if (!Schema::hasColumn('users', 'avatar')) {
                    $table->string('avatar')->nullable();
                }
                if (!Schema::hasColumn('users', 'role')) {
                    $table->enum('role', ['customer', 'admin', 'super_admin'])->default('customer');
                }
                if (!Schema::hasColumn('users', 'status')) {
                    $table->enum('status', ['active', 'inactive', 'blocked'])->default('active');
                }
                if (!Schema::hasColumn('users', 'loyalty_points')) {
                    $table->integer('loyalty_points')->default(0);
                }
                if (!Schema::hasColumn('users', 'last_login_at')) {
                    $table->timestamp('last_login_at')->nullable();
                }
            });
        }

        // --- 2. create_categories_table ---
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('image')->nullable();
                $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
                $table->integer('sort_order')->default(0);
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('categories', function (Blueprint $table) {
                if (!Schema::hasColumn('categories', 'slug')) {
                    $table->string('slug')->unique();
                }
                if (!Schema::hasColumn('categories', 'description')) {
                    $table->text('description')->nullable();
                }
                if (!Schema::hasColumn('categories', 'image')) {
                    $table->string('image')->nullable();
                }
                if (!Schema::hasColumn('categories', 'parent_id')) {
                    $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
                }
                if (!Schema::hasColumn('categories', 'sort_order')) {
                    $table->integer('sort_order')->default(0);
                }
                if (!Schema::hasColumn('categories', 'status')) {
                    $table->enum('status', ['active', 'inactive'])->default('active');
                }
                if (!Schema::hasColumn('categories', 'meta_title')) {
                    $table->string('meta_title')->nullable();
                }
                if (!Schema::hasColumn('categories', 'meta_description')) {
                    $table->text('meta_description')->nullable();
                }
            });
        }

        // --- 3. create_products_table ---
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description');
                $table->string('short_description', 500)->nullable();
                $table->string('sku', 100)->unique();
                $table->decimal('price', 10, 2);
                $table->decimal('compare_price', 10, 2)->nullable();
                $table->decimal('cost_price', 10, 2)->nullable();
                $table->boolean('track_quantity')->default(true);
                $table->integer('quantity')->default(0);
                $table->integer('min_quantity')->default(1);
                $table->decimal('weight', 8, 2)->nullable();
                $table->json('dimensions')->nullable();
                $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
                $table->boolean('featured')->default(false);
                $table->boolean('digital')->default(false);
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        } else {
            Schema::table('products', function (Blueprint $table) {
                if (!Schema::hasColumn('products', 'short_description')) {
                    $table->string('short_description', 500)->nullable();
                }
                if (!Schema::hasColumn('products', 'sku')) {
                    $table->string('sku', 100)->unique();
                }
                if (!Schema::hasColumn('products', 'compare_price')) {
                    $table->decimal('compare_price', 10, 2)->nullable();
                }
                if (!Schema::hasColumn('products', 'cost_price')) {
                    $table->decimal('cost_price', 10, 2)->nullable();
                }
                if (!Schema::hasColumn('products', 'track_quantity')) {
                    $table->boolean('track_quantity')->default(true);
                }
                if (!Schema::hasColumn('products', 'quantity')) {
                    $table->integer('quantity')->default(0);
                }
                if (!Schema::hasColumn('products', 'min_quantity')) {
                    $table->integer('min_quantity')->default(1);
                }
                if (!Schema::hasColumn('products', 'weight')) {
                    $table->decimal('weight', 8, 2)->nullable();
                }
                if (!Schema::hasColumn('products', 'dimensions')) {
                    $table->json('dimensions')->nullable();
                }
                if (!Schema::hasColumn('products', 'status')) {
                    $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
                }
                if (!Schema::hasColumn('products', 'featured')) {
                    $table->boolean('featured')->default(false);
                }
                if (!Schema::hasColumn('products', 'digital')) {
                    $table->boolean('digital')->default(false);
                }
                if (!Schema::hasColumn('products', 'meta_title')) {
                    $table->string('meta_title')->nullable();
                }
                if (!Schema::hasColumn('products', 'meta_description')) {
                    $table->text('meta_description')->nullable();
                }
            });
        }

        // --- 4. create_product_categories_table (Pivot) ---
        if (!Schema::hasTable('product_categories')) {
            Schema::create('product_categories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->foreignId('category_id')->constrained()->onDelete('cascade');
                $table->timestamps();
            });
        }

        // --- 5. create_product_images_table ---
        if (!Schema::hasTable('product_images')) {
            Schema::create('product_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->string('image_path');
                $table->string('alt_text')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_primary')->default(false);
                $table->timestamps();
            });
        } else {
            Schema::table('product_images', function (Blueprint $table) {
                if (!Schema::hasColumn('product_images', 'image_path')) {
                    $table->string('image_path');
                }
                if (!Schema::hasColumn('product_images', 'alt_text')) {
                    $table->string('alt_text')->nullable();
                }
                if (!Schema::hasColumn('product_images', 'sort_order')) {
                    $table->integer('sort_order')->default(0);
                }
                if (!Schema::hasColumn('product_images', 'is_primary')) {
                    $table->boolean('is_primary')->default(false);
                }
            });
        }

        // --- 6. create_product_attributes_table ---
        if (!Schema::hasTable('product_attributes')) {
            Schema::create('product_attributes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->string('name', 100);
                $table->string('value');
                $table->timestamps();
            });
        }

        // --- 7. create_orders_table ---
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number', 50)->unique();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
                $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
                $table->string('payment_method', 50);
                $table->decimal('subtotal', 10, 2);
                $table->decimal('tax_amount', 10, 2)->default(0);
                $table->decimal('shipping_amount', 10, 2)->default(0);
                $table->decimal('discount_amount', 10, 2)->default(0);
                $table->decimal('total_amount', 10, 2);
                $table->string('currency', 3)->default('SAR');
                $table->text('notes')->nullable();
                $table->timestamp('shipped_at')->nullable();
                $table->timestamp('delivered_at')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'user_id')) {
                    $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                }
                if (!Schema::hasColumn('orders', 'status')) {
                    $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
                }
                if (!Schema::hasColumn('orders', 'payment_status')) {
                    $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
                }
                if (!Schema::hasColumn('orders', 'payment_method')) {
                    $table->string('payment_method', 50);
                }
                if (!Schema::hasColumn('orders', 'subtotal')) {
                    $table->decimal('subtotal', 10, 2);
                }
                if (!Schema::hasColumn('orders', 'tax_amount')) {
                    $table->decimal('tax_amount', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('orders', 'shipping_amount')) {
                    $table->decimal('shipping_amount', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('orders', 'discount_amount')) {
                    $table->decimal('discount_amount', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('orders', 'total_amount')) {
                    $table->decimal('total_amount', 10, 2);
                }
                if (!Schema::hasColumn('orders', 'currency')) {
                    $table->string('currency', 3)->default('SAR');
                }
                if (!Schema::hasColumn('orders', 'notes')) {
                    $table->text('notes')->nullable();
                }
                if (!Schema::hasColumn('orders', 'shipped_at')) {
                    $table->timestamp('shipped_at')->nullable();
                }
                if (!Schema::hasColumn('orders', 'delivered_at')) {
                    $table->timestamp('delivered_at')->nullable();
                }
            });
        }

        // --- 8. create_order_items_table ---
        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->onDelete('cascade');
                $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
                $table->string('product_name');
                $table->string('product_sku', 100);
                $table->integer('quantity');
                $table->decimal('price', 10, 2);
                $table->decimal('total', 10, 2);
                $table->timestamps();
            });
        } else {
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'product_id')) {
                    $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
                }
                if (!Schema::hasColumn('order_items', 'product_name')) {
                    $table->string('product_name');
                }
                if (!Schema::hasColumn('order_items', 'product_sku')) {
                    $table->string('product_sku', 100);
                }
                if (!Schema::hasColumn('order_items', 'quantity')) {
                    $table->integer('quantity');
                }
                if (!Schema::hasColumn('order_items', 'price')) {
                    $table->decimal('price', 10, 2);
                }
                if (!Schema::hasColumn('order_items', 'total')) {
                    $table->decimal('total', 10, 2);
                }
            });
        }

        // --- 9. create_addresses_table ---
        if (!Schema::hasTable('addresses')) {
            Schema::create('addresses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->enum('type', ['home', 'work', 'other'])->default('home');
                $table->string('first_name', 100);
                $table->string('last_name', 100);
                $table->string('company')->nullable();
                $table->string('address_line_1');
                $table->string('address_line_2')->nullable();
                $table->string('city', 100);
                $table->string('state', 100);
                $table->string('postal_code', 20);
                $table->string('country', 100)->default('Saudi Arabia');
                $table->string('phone', 20)->nullable();
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        } else {
            Schema::table('addresses', function (Blueprint $table) {
                if (!Schema::hasColumn('addresses', 'type')) {
                    $table->enum('type', ['home', 'work', 'other'])->default('home');
                }
                if (!Schema::hasColumn('addresses', 'company')) {
                    $table->string('company')->nullable();
                }
                if (!Schema::hasColumn('addresses', 'address_line_2')) {
                    $table->string('address_line_2')->nullable();
                }
                if (!Schema::hasColumn('addresses', 'phone')) {
                    $table->string('phone', 20)->nullable();
                }
                if (!Schema::hasColumn('addresses', 'is_default')) {
                    $table->boolean('is_default')->default(false);
                }
            });
        }

        // --- 10. create_cart_items_table ---
        if (!Schema::hasTable('cart_items')) {
            Schema::create('cart_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
                $table->string('session_id')->nullable();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->integer('quantity');
                $table->timestamps();
            });
        }

        // --- 11. create_wishlists_table ---
        if (!Schema::hasTable('wishlists')) {
            Schema::create('wishlists', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->timestamps();
            });
        }

        // --- 12. create_coupons_table ---
        if (!Schema::hasTable('coupons')) {
            Schema::create('coupons', function (Blueprint $table) {
                $table->id();
                $table->string('code', 50)->unique();
                $table->enum('type', ['fixed', 'percentage']);
                $table->decimal('value', 10, 2);
                $table->decimal('minimum_amount', 10, 2)->nullable();
                $table->integer('usage_limit')->nullable();
                $table->integer('used_count')->default(0);
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->timestamps();
            });
        } else {
            Schema::table('coupons', function (Blueprint $table) {
                if (!Schema::hasColumn('coupons', 'type')) {
                    $table->enum('type', ['fixed', 'percentage']);
                }
                if (!Schema::hasColumn('coupons', 'minimum_amount')) {
                    $table->decimal('minimum_amount', 10, 2)->nullable();
                }
                if (!Schema::hasColumn('coupons', 'usage_limit')) {
                    $table->integer('usage_limit')->nullable();
                }
                if (!Schema::hasColumn('coupons', 'used_count')) {
                    $table->integer('used_count')->default(0);
                }
                if (!Schema::hasColumn('coupons', 'starts_at')) {
                    $table->timestamp('starts_at')->nullable();
                }
                if (!Schema::hasColumn('coupons', 'expires_at')) {
                    $table->timestamp('expires_at')->nullable();
                }
                if (!Schema::hasColumn('coupons', 'status')) {
                    $table->enum('status', ['active', 'inactive'])->default('active');
                }
            });
        }

        // --- 13. create_reviews_table ---
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->tinyInteger('rating')->unsigned(); // 1-5
                $table->string('title')->nullable();
                $table->text('comment')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->timestamps();
            });
        } else {
            Schema::table('reviews', function (Blueprint $table) {
                if (!Schema::hasColumn('reviews', 'user_id')) {
                    $table->foreignId('user_id')->constrained()->onDelete('cascade');
                }
                if (!Schema::hasColumn('reviews', 'rating')) {
                    $table->tinyInteger('rating')->unsigned(); // 1-5
                }
                if (!Schema::hasColumn('reviews', 'title')) {
                    $table->string('title')->nullable();
                }
                if (!Schema::hasColumn('reviews', 'comment')) {
                    $table->text('comment')->nullable();
                }
                if (!Schema::hasColumn('reviews', 'status')) {
                    $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                }
            });
        }

        // --- 14. create_settings_table ---
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('type', 50)->default('string');
                $table->string('group', 100)->default('general');
                $table->timestamps();
            });
        } else {
            Schema::table('settings', function (Blueprint $table) {
                if (!Schema::hasColumn('settings', 'value')) {
                    $table->text('value')->nullable();
                }
                if (!Schema::hasColumn('settings', 'type')) {
                    $table->string('type', 50)->default('string');
                }
                if (!Schema::hasColumn('settings', 'group')) {
                    $table->string('group', 100)->default('general');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop tables in reverse order of creation to respect foreign keys
        Schema::dropIfExists('settings');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');
    }
};
