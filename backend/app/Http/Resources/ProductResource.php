<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'image'             => $this->image, // حقل الصورة الرئيسية
            'images'            => $this->images ? explode(',', $this->images) : [],
        ];
    }
}
