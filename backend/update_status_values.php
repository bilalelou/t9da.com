<?php

require 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Setup database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'sqlite',
    'database' => __DIR__ . '/database/database.sqlite',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    echo "Updating existing order status values...\n";

    // Map old status values to new ones
    $statusMap = [
        'ordered' => 'confirmed',
        'delivered' => 'delivered',
        'canceled' => 'cancelled'
    ];

    // Get all orders
    $orders = Capsule::table('orders')->get();
    echo "Found " . count($orders) . " orders\n";

    // Update each order's status if it has an old value
    foreach ($orders as $order) {
        if (isset($statusMap[$order->status])) {
            $newStatus = $statusMap[$order->status];
            Capsule::table('orders')
                ->where('id', $order->id)
                ->update(['status' => $newStatus]);
            echo "Updated order {$order->id}: {$order->status} -> {$newStatus}\n";
        } else {
            echo "Order {$order->id} already has status: {$order->status}\n";
        }
    }

    echo "Status update completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
