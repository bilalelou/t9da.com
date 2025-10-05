<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSizeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'اسم الحجم',
            'display_name' => 'الاسم المعروض',
            'sort_order' => 'ترتيب العرض',
            'is_active' => 'حالة التفعيل'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'اسم الحجم مطلوب',
            'name.string' => 'اسم الحجم يجب أن يكون نصاً',
            'name.max' => 'اسم الحجم يجب ألا يتجاوز 255 حرفاً',
            'display_name.required' => 'الاسم المعروض مطلوب',
            'display_name.string' => 'الاسم المعروض يجب أن يكون نصاً',
            'display_name.max' => 'الاسم المعروض يجب ألا يتجاوز 255 حرفاً',
            'sort_order.integer' => 'ترتيب العرض يجب أن يكون رقماً صحيحاً',
            'sort_order.min' => 'ترتيب العرض يجب أن يكون صفراً أو أكبر',
            'is_active.boolean' => 'حالة التفعيل يجب أن تكون صحيحة أو خاطئة'
        ];
    }
}
