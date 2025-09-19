<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('📦 إنشاء الطلبات التجريبية...');

        // نظف البيانات الموجودة
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();

        // جلب العملاء والمنتجات
        $customers = User::role('customer')->get();
        $products = Product::all();

        if ($customers->isEmpty() || $products->isEmpty()) {
            $this->command->info('❌ لا يمكن إنشاء الطلبات. الرجاء التأكد من وجود عملاء ومنتجات أولاً.');
            return;
        }

        $orderStatuses = ['ordered', 'delivered', 'canceled'];
        $paymentMethods = ['cod', 'card'];
        $cities = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'أكادير', 'طنجة', 'وجدة', 'تطوان'];
        $states = ['الدار البيضاء-سطات', 'الرباط-سلا-القنيطرة', 'مراكش-آسفي', 'فاس-مكناس', 'سوس-ماسة', 'طنجة-تطوان-الحسيمة', 'الشرق', 'بني ملال-خنيفرة'];

        // إنشاء 25 طلب تجريبي
        for ($i = 0; $i < 25; $i++) {
            $customer = $customers->random();
            $status = $orderStatuses[array_rand($orderStatuses)];
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $city = $cities[array_rand($cities)];
            $state = $states[array_rand($states)];

            // حساب تاريخ عشوائي خلال الـ 30 يوم الماضية
            $createdAt = now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            $order = Order::create([
                'user_id' => $customer->id,
                'order_number' => 'ORD-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'subtotal' => 0, // سيتم حسابه لاحقاً
                'discount' => rand(0, 1) ? rand(50, 500) : 0,
                'tax' => 0,
                'total' => 0, // سيتم حسابه لاحقاً
                'total_amount' => 0, // سيتم حسابه لاحقاً
                'name' => $customer->name,
                'phone' => '0' . rand(6, 7) . rand(10000000, 99999999),
                'address' => 'شارع ' . rand(1, 100) . '، حي ' . ['المحمدية', 'الأندلس', 'الرياض', 'المعارف'][array_rand(['المحمدية', 'الأندلس', 'الرياض', 'المعارف'])],
                'locality' => ['المحمدية', 'الأندلس', 'الرياض', 'المعارف', 'النخيل', 'السلام'][array_rand(['المحمدية', 'الأندلس', 'الرياض', 'المعارف', 'النخيل', 'السلام'])],
                'city' => $city,
                'state' => $state,
                'country' => 'المغرب',
                'zip' => rand(10000, 99999),
                'shipping_name' => $customer->name,
                'shipping_email' => $customer->email,
                'shipping_phone' => '0' . rand(6, 7) . rand(10000000, 99999999),
                'shipping_address' => 'شارع ' . rand(1, 100) . '، حي ' . ['المحمدية', 'الأندلس', 'الرياض', 'المعارف'][array_rand(['المحمدية', 'الأندلس', 'الرياض', 'المعارف'])],
                'shipping_city' => $city,
                'shipping_state' => $state,
                'shipping_postal_code' => rand(10000, 99999),
                'shipping_method' => 'standard',
                'currency' => 'MAD',
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentMethod === 'cod' ? 'pending' : ($status === 'delivered' ? 'paid' : 'pending'),
                'notes' => rand(0, 1) ? 'ملاحظات خاصة بالطلب رقم ' . ($i + 1) : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // إضافة عناصر الطلب
            $numberOfItems = rand(1, 4);
            $subtotal = 0;

            for ($j = 0; $j < $numberOfItems; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $price = $product->sale_price ?? $product->regular_price;
                $itemTotal = $quantity * $price;
                $subtotal += $itemTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $itemTotal,
                    'product_name' => $product->name,
                    'product_sku' => $product->SKU,
                ]);
            }

            // تحديث المجاميع في الطلب
            $shippingCost = $subtotal > 500 ? 0 : 50; // شحن مجاني للطلبات أكثر من 500 درهم
            $total = $subtotal + $shippingCost - $order->discount;

            $order->update([
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'total_amount' => $total,
            ]);

            // تحديث تاريخ الحالة حسب الحالة
            if ($status === 'delivered') {
                $order->update(['delivered_at' => $createdAt->addDays(rand(1, 7))]);
            } elseif ($status === 'canceled') {
                $order->update(['canceled_date' => $createdAt->addDays(rand(0, 3))]);
            }
        }

        // إنشاء بعض الطلبات الحديثة (اليوم)
        for ($i = 0; $i < 5; $i++) {
            $customer = $customers->random();
            $createdAt = now()->subHours(rand(0, 12));

            $order = Order::create([
                'user_id' => $customer->id,
                'order_number' => 'ORD-R-' . str_pad($i + 26, 6, '0', STR_PAD_LEFT),
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
                'total_amount' => 0,
                'name' => $customer->name,
                'phone' => '0' . rand(6, 7) . rand(10000000, 99999999),
                'address' => 'شارع الحرية، رقم ' . rand(1, 200),
                'locality' => ['المحمدية', 'الأندلس', 'الرياض', 'المعارف'][array_rand(['المحمدية', 'الأندلس', 'الرياض', 'المعارف'])],
                'city' => $cities[array_rand($cities)],
                'state' => $states[array_rand($states)],
                'country' => 'المغرب',
                'zip' => rand(10000, 99999),
                'shipping_name' => $customer->name,
                'shipping_email' => $customer->email,
                'shipping_phone' => '0' . rand(6, 7) . rand(10000000, 99999999),
                'shipping_address' => 'شارع الحرية، رقم ' . rand(1, 200),
                'shipping_city' => $cities[array_rand($cities)],
                'shipping_state' => $states[array_rand($states)],
                'shipping_postal_code' => rand(10000, 99999),
                'shipping_method' => 'standard',
                'currency' => 'MAD',
                'status' => 'ordered',
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => 'pending',
                'notes' => 'طلب حديث - اليوم',
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // إضافة منتجات للطلب الحديث
            $product = $products->random();
            $quantity = rand(1, 2);
            $price = $product->sale_price ?? $product->regular_price;
            $itemTotal = $quantity * $price;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $price,
                'total' => $itemTotal,
                'product_name' => $product->name,
                'product_sku' => $product->SKU,
            ]);

            $shippingCost = $itemTotal > 500 ? 0 : 50;
            $order->update([
                'subtotal' => $itemTotal,
                'shipping_cost' => $shippingCost,
                'total' => $itemTotal + $shippingCost,
                'total_amount' => $itemTotal + $shippingCost,
            ]);
        }

        $totalOrders = Order::count();
        $this->command->info("✅ تم إنشاء {$totalOrders} طلب تجريبي بحالات مختلفة");
    }
}
