<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            // جلب روابط الصور فقط من العلاقة
            // (FINAL FIX) Decode the JSON string from the database
            // نقوم بتحويل النص الذي يحتوي على JSON إلى مصفوفة حقيقية
            'images' => json_decode($this->images) ?? [], // إذا فشل التحويل، نرجع مصفوفة فارغة
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
