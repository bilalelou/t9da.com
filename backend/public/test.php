<?php
// Simple test file to check if PHP/Laravel is working
echo "Laravel Backend Test - " . date('Y-m-d H:i:s');
echo "\n";
echo "PHP Version: " . phpversion();
echo "\n";
echo "Current Directory: " . __DIR__;
echo "\n";
echo "File exists test: " . (file_exists('index.php') ? 'index.php found' : 'index.php not found');