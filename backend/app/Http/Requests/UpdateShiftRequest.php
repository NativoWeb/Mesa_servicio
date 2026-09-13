<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'technician_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'campus' => 'nullable|string|max:100',
            'building' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:scheduled,active,completed',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'technician_id.exists' => 'El tecnico seleccionado no existe.',
            'start_time.date_format' => 'La hora de inicio debe tener el formato HH:MM.',
            'end_time.date_format' => 'La hora de fin debe tener el formato HH:MM.',
        ];
    }
}
