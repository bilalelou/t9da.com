<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ProductVideo;

echo "Checking videos in database:\n";
echo "============================\n";

$videos = ProductVideo::all();

foreach($videos as $video) {
    echo "ID: {$video->id}\n";
    echo "Type: {$video->video_type}\n";
    echo "URL: {$video->video_url}\n";
    echo "Full URL: {$video->full_video_url}\n";
    echo "Product ID: {$video->product_id}\n";
    echo "---\n";
}

echo "\nTotal videos: " . $videos->count() . "\n";