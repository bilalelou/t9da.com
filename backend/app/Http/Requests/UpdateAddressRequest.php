<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
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
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'type' => 'required|in:home,work,other',
            'is_default' => 'nullable|boolean',
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
            'name' => 'الاسم',
            'address' => 'العنوان',
            'city' => 'المدينة',
            'phone' => 'رقم الهاتف',
            'type' => 'نوع العنوان',
            'is_default' => 'العنوان الافتراضي'
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
            'name.required' => 'الاسم مطلوب',
            'name.string' => 'الاسم يجب أن يكون نصاً',
            'name.max' => 'الاسم يجب ألا يتجاوز 255 حرفاً',
            'address.required' => 'العنوان مطلوب',
            'address.string' => 'العنوان يجب أن يكون نصاً',
            'address.max' => 'العنوان يجب ألا يتجاوز 255 حرفاً',
            'city.required' => 'المدينة مطلوبة',
            'city.string' => 'المدينة يجب أن تكون نصاً',
            'city.max' => 'المدينة يجب ألا تتجاوز 255 حرفاً',
            'phone.required' => 'رقم الهاتف مطلوب',
            'phone.string' => 'رقم الهاتف يجب أن يكون نصاً',
            'phone.max' => 'رقم الهاتف يج�� ألا يتجاو�� 20 حرفاً',
            'type.required' => 'نوع العنوان مطلوب',
            'type.in' => 'نوع العنوان يجب أن يكون: منزل، عمل، أو آخر',
            'is_default.boolean' => 'العنوان الافتراضي يجب أن يكون صحيحاً أو خاطئاً'
        ];
    }
}
