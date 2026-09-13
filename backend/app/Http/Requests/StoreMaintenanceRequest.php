<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'type' => 'required|string|in:preventive,corrective,update,cleaning',
            'description' => 'nullable|string',
            'technician_id' => 'required|exists:users,id',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date|after_or_equal:started_at',
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
            'asset_id.required' => 'El activo es obligatorio.',
            'asset_id.exists' => 'El activo seleccionado no existe.',
            'type.required' => 'El tipo de mantenimiento es obligatorio.',
            'type.in' => 'El tipo de mantenimiento debe ser: preventivo, correctivo, actualizacion o limpieza.',
            'technician_id.required' => 'El tecnico es obligatorio.',
            'technician_id.exists' => 'El tecnico seleccionado no existe.',
            'finished_at.after_or_equal' => 'La fecha de finalizacion debe ser igual o posterior a la fecha de inicio.',
            'duration_minutes.min' => 'La duracion no puede ser negativa.',
        ];
    }
}
