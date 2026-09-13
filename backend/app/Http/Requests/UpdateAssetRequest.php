<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|in:pc,laptop,printer,server,router,switch,monitor,projector,other',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'serial' => 'nullable|string|max:100|unique:assets,serial,' . $this->route('asset')->id,
            'purchase_date' => 'nullable|date',
            'campus' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'holder_id' => 'nullable|exists:users,id',
            'status' => 'nullable|string|in:new,operational,damaged,decommissioned,retired',
            'specs' => 'nullable|array',
            'warranty_expiry' => 'nullable|date',
            'next_maintenance' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.max' => 'El nombre no puede superar los 255 caracteres.',
            'category.in' => 'La categoria proporcionada no es valida.',
            'serial.unique' => 'El numero de serie ya esta registrado.',
            'holder_id.exists' => 'El cuentadante seleccionado no existe.',
            'status.in' => 'El estado proporcionado no es valido.',
        ];
    }
}
