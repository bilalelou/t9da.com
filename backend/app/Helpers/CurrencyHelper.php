<?php

namespace App\Helpers;

class CurrencyHelper
{
    /**
     * Format price with currency symbol
     */
    public static function format($amount, $currency = 'MAD')
    {
        $currencies = config('currency.currencies');
        $currencyConfig = $currencies[$currency] ?? $currencies['MAD'];
        
        $formattedAmount = number_format(
            $amount,
            $currencyConfig['decimal_places'],
            $currencyConfig['decimal_separator'],
            $currencyConfig['thousands_separator']
        );
        
        return sprintf($currencyConfig['format'], $formattedAmount);
    }

    /**
     * Get currency symbol
     */
    public static function symbol($currency = 'MAD')
    {
        $currencies = config('currency.currencies');
        return $currencies[$currency]['symbol'] ?? 'د.م.';
    }

    /**
     * Get currency code
     */
    public static function code($currency = 'MAD')
    {
        $currencies = config('currency.currencies');
        return $currencies[$currency]['code'] ?? 'MAD';
    }

    /**
     * Get currency name
     */
    public static function name($currency = 'MAD')
    {
        $currencies = config('currency.currencies');
        return $currencies[$currency]['name'] ?? 'درهم مغربي';
    }

    /**
     * Convert amount to cents/smallest unit
     */
    public static function toCents($amount)
    {
        return (int) ($amount * 100);
    }

    /**
     * Convert cents to amount
     */
    public static function fromCents($cents)
    {
        return $cents / 100;
    }

    /**
     * Get default currency
     */
    public static function default()
    {
        return config('currency.default', 'MAD');
    }
}