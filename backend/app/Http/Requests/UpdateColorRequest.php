<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateColorRequest extends FormRequest
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
            'hex_code' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
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
            'name' => 'اسم اللون',
            'hex_code' => 'كود اللون',
            'is_active' => 'حالة التفع��ل'
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
            'name.required' => 'اسم اللون مطلوب',
            'name.string' => 'اسم اللون يجب أن يكون نصاً',
            'name.max' => 'اسم اللون يجب ألا يتجاوز 255 حرفاً',
            'hex_code.required' => 'كود اللون مطلوب',
            'hex_code.string' => 'كود اللون يجب أن يكون نصاً',
            'hex_code.regex' => 'كود اللون يجب أن يكون بصيغة صحيحة (مثال: #FF5733)',
            'is_active.boolean' => 'حالة التفعيل يجب أن تكون صحيحة أو خاطئة'
        ];
    }
}
