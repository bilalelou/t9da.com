<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:brands,name',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:1024',
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
            'name' => 'اسم الماركة',
            'logo' => 'شعار الماركة'
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
            'name.required' => 'اسم الماركة مطلوب',
            'name.string' => 'اسم الماركة يجب أن يكون نصاً',
            'name.max' => 'اسم الماركة يجب ألا يتجاوز 255 حرفاً',
            'name.unique' => 'اسم الماركة موجود مسبقاً',
            'logo.image' => 'الشعار يجب أن يكون صورة',
            'logo.mimes' => 'الشعار يجب أن يكون من نوع: jpeg, png, jpg, gif, svg, webp',
            'logo.max' => 'حجم الشعار يجب ألا يتجاوز 1 ميجابايت'
        ];
    }
}
