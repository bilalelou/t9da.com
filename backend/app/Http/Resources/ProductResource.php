<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\CurrencyHelper;

class ProductResource extends JsonResource
{
   public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'slug'              => $this->slug,
            'short_description' => $this->short_description,
            'description'       => $this->description,
            'regular_price'     => $this->regular_price,
            'sale_price'        => $this->sale_price,
            'regular_price_formatted' => CurrencyHelper::format($this->regular_price),
            'sale_price_formatted' => $this->sale_price ? CurrencyHelper::format($this->sale_price) : null,
            'currency'          => CurrencyHelper::default(),
            'currency_symbol'   => CurrencyHelper::symbol(),
            'image'             => $this->image,
            'images'            => $this->images ? explode(',', $this->images) : [],
        ];
    }
}
