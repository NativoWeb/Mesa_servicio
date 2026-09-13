<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaintenanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'type' => 'sometimes|string|in:preventive,corrective,update,cleaning',
            'description' => 'nullable|string',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:0',
            'final_status' => 'nullable|string|max:100',
            'next_maintenance_date' => 'nullable|date',
            'observations' => 'nullable|string',
            'status' => 'nullable|string|in:completed,partial,escalated',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'type.in' => 'El tipo de mantenimiento debe ser: preventivo, correctivo, actualizacion o limpieza.',
            'duration_minutes.min' => 'La duracion no puede ser negativa.',
        ];
    }
}
