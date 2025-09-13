<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // جلب كل المستخدمين الذين لديهم دور "customer"
        $customers = User::role('customer')->get();
        // جلب أول 10 منتجات لاستخدامها في الطلبات
        $products = Product::take(10)->get();

        if ($customers->isEmpty() || $products->isEmpty()) {
            $this->command->info('لا يمكن إنشاء الطلبات. الرجاء التأكد من وجود عملاء ومنتجات أولاً.');
            return;
        }

        // تم تحديث الحالات لتطابق هيكل قاعدة البيانات
        $orderStatuses = ['ordered', 'delivered', 'canceled'];
        $paymentMethods = ['cod', 'card']; // [إضافة] طرق الدفع
        $cities = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'أكادير'];

        // إنشاء 20 طلب وهمي
        for ($i = 0; $i < 20; $i++) {
            $customer = $customers->random();
            $totalPrice = 0;
            $orderItemsData = [];

            // حساب السعر الإجمالي أولاً
            $numberOfItems = rand(1, 5);
            for ($j = 0; $j < $numberOfItems; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $price = $product->sale_price ?? $product->regular_price;
                $itemTotal = $quantity * $price;

                $totalPrice += $itemTotal;

                // [تصحيح] إضافة اسم المنتج و SKU و total إلى بيانات عنصر الطلب
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->SKU,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $itemTotal, // <--- تم إضافة هذا السطر
                ];
            }

            $selectedCity = $cities[array_rand($cities)];

            // [تصحيح] تم تحديث الحقول لتطابق تماماً هيكل جدول orders
            $order = Order::create([
                'user_id' => $customer->id,
                'status' => $orderStatuses[array_rand($orderStatuses)],
                'created_at' => now()->subDays(rand(0, 30)),

                'name' => $customer->name,
                'phone' => $customer->mobile ?? '0600000000',
                'city' => $selectedCity,
                'state' => $selectedCity,
                'address' => 'شارع مثال ' . rand(1, 100),
                'locality' => 'حي وهمي',
                'zip' => (string)rand(10000, 90000), // تحويله إلى نص
                'country' => 'المغرب',

                // الحقول المالية
                'total' => $totalPrice,
                'subtotal' => $totalPrice,
                'tax' => 0,
                'discount' => 0,
                'total_amount' => $totalPrice,

                'payment_method' => $paymentMethods[array_rand($paymentMethods)],

            ]);

            // إضافة المنتجات المرتبطة بالطلب
            foreach($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }
        }
    }
}

