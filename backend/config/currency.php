<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Currency
    |--------------------------------------------------------------------------
    |
    | This option controls the default currency used throughout the application.
    |
    */
    'default' => env('CURRENCY_DEFAULT', 'MAD'),

    /*
    |--------------------------------------------------------------------------
    | Currency Settings
    |--------------------------------------------------------------------------
    |
    | Here you can configure the currency settings for the application.
    |
    */
    'currencies' => [
        'MAD' => [
            'name' => 'درهم مغربي',
            'code' => 'MAD',
            'symbol' => 'د.م.',
            'format' => '%s د.م.',
            'decimal_places' => 2,
            'thousands_separator' => ',',
            'decimal_separator' => '.',
        ],
        'USD' => [
            'name' => 'US Dollar',
            'code' => 'USD',
            'symbol' => '$',
            'format' => '$%s',
            'decimal_places' => 2,
            'thousands_separator' => ',',
            'decimal_separator' => '.',
        ],
        'EUR' => [
            'name' => 'Euro',
            'code' => 'EUR',
            'symbol' => '€',
            'format' => '€%s',
            'decimal_places' => 2,
            'thousands_separator' => ',',
            'decimal_separator' => '.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency Display
    |--------------------------------------------------------------------------
    |
    | These options control how currencies are displayed in the application.
    |
    */
    'display' => [
        'show_symbol' => true,
        'show_code' => false,
        'position' => 'after', // 'before' or 'after'
    ],
];