<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'nullable|string|max:100',
            'priority' => 'sometimes|string|in:low,medium,high,critical',
            'status' => 'sometimes|string|in:open,in_progress,pending,escalated,closed',
            'assigned_to' => 'nullable|exists:users,id',
            'campus' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'escalated_to' => 'nullable|exists:users,id',
            'escalation_reason' => 'nullable|string',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.max' => 'El titulo no puede superar los 255 caracteres.',
            'priority.in' => 'La prioridad debe ser: baja, media, alta o critica.',
            'status.in' => 'El estado proporcionado no es valido.',
            'assigned_to.exists' => 'El usuario asignado no existe.',
            'escalated_to.exists' => 'El usuario de escalamiento no existe.',
        ];
    }
}
