<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:100',
            'priority' => 'required|string|in:low,medium,high,critical',
            'campus' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.required' => 'El titulo del ticket es obligatorio.',
            'title.max' => 'El titulo no puede superar los 255 caracteres.',
            'description.required' => 'La descripcion del ticket es obligatoria.',
            'priority.required' => 'La prioridad es obligatoria.',
            'priority.in' => 'La prioridad debe ser: baja, media, alta o critica.',
        ];
    }
}
