<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'token.required' => 'El token de restablecimiento es obligatorio.',
            'email.required' => 'El correo electronico es obligatorio.',
            'email.email' => 'Debe proporcionar un correo electronico valido.',
            'password.required' => 'La nueva contrasena es obligatoria.',
            'password.min' => 'La contrasena debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmacion de la contrasena no coincide.',
        ];
    }
}
