<?php

// Test the videos API endpoint directly
echo "Testing Videos API Endpoint\n";
echo "===========================\n";

$url = 'http://127.0.0.1:8000/api/products/1/videos';
echo "URL: $url\n\n";

// Create context for the HTTP request
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => [
            'Accept: application/json',
            'Content-Type: application/json'
        ]
    ]
]);

// Make the request
$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "Failed to fetch data\n";
    if (isset($http_response_header)) {
        echo "Headers:\n";
        var_dump($http_response_header);
    }
} else {
    echo "Response received:\n";
    echo "Length: " . strlen($response) . " bytes\n";
    echo "First 500 chars: " . substr($response, 0, 500) . "\n\n";
    
    // Try to decode JSON
    $data = json_decode($response, true);
    if ($data !== null) {
        echo "Valid JSON detected!\n";
        echo "Decoded data:\n";
        print_r($data);
    } else {
        echo "Not valid JSON - this is likely HTML\n";
        echo "JSON error: " . json_last_error_msg() . "\n";
    }
}