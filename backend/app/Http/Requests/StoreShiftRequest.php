<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'technician_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'campus' => 'nullable|string|max:100',
            'building' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:scheduled,active,completed',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'technician_id.required' => 'El tecnico es obligatorio.',
            'technician_id.exists' => 'El tecnico seleccionado no existe.',
            'date.required' => 'La fecha del turno es obligatoria.',
            'start_time.required' => 'La hora de inicio es obligatoria.',
            'start_time.date_format' => 'La hora de inicio debe tener el formato HH:MM.',
            'end_time.required' => 'La hora de fin es obligatoria.',
            'end_time.date_format' => 'La hora de fin debe tener el formato HH:MM.',
            'end_time.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
        ];
    }
}
