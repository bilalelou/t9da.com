<?php

require_once 'bootstrap/app.php';

use App\Models\Product;

echo "=== فحص API مباشرة ===\n\n";

// جلب المنتج التجريبي
$product = Product::where('name', 'تيشيرت قطني تجريبي')->first();

if ($product) {
    echo "1. معلومات المنتج:\n";
    echo "   - ID: {$product->id}\n";
    echo "   - Name: {$product->name}\n";
    echo "   - Slug: {$product->slug}\n";
    echo "   - has_variants: " . ($product->has_variants ? 'true' : 'false') . "\n\n";

    // محاكاة API endpoint
    $apiUrl = "http://localhost:8000/api/products/{$product->slug}";
    echo "2. محاكاة API call:\n";
    echo "   URL: {$apiUrl}\n\n";

    // جلب بيانات من API فعلياً
    $context = stream_context_create([
        "http" => [
            "timeout" => 30,
            "ignore_errors" => true
        ]
    ]);

    $response = file_get_contents($apiUrl, false, $context);
    $httpStatus = explode(' ', $http_response_header[0])[1];

    echo "3. نتيجة API:\n";
    echo "   HTTP Status: {$httpStatus}\n";

    if ($response && $httpStatus == '200') {
        $data = json_decode($response, true);
        echo "   ✅ API Response successful\n";
        echo "   Has variants: " . ($data['product']['has_variants'] ? 'true' : 'false') . "\n";

        if (isset($data['product']['variants'])) {
            echo "   Variants in response: " . count($data['product']['variants']) . "\n";
        } else {
            echo "   ❌ No variants in response\n";
        }

        if (isset($data['product']['available_colors'])) {
            echo "   Available colors: " . count($data['product']['available_colors']) . "\n";
            foreach ($data['product']['available_colors'] as $color) {
                echo "     - {$color['name']} ({$color['hex_code']})\n";
            }
        } else {
            echo "   ❌ No available_colors in response\n";
        }

        if (isset($data['product']['available_sizes'])) {
            echo "   Available sizes: " . count($data['product']['available_sizes']) . "\n";
            foreach ($data['product']['available_sizes'] as $size) {
                echo "     - {$size['display_name']}\n";
            }
        } else {
            echo "   ❌ No available_sizes in response\n";
        }

    } else {
        echo "   ❌ API call failed\n";
        echo "   Response: " . substr($response, 0, 200) . "...\n";
    }

} else {
    echo "❌ المنتج التجريبي غير موجود\n";
}

echo "\n=== انتهى الفحص ===\n";
