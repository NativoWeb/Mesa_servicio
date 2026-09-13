<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'channel' => 'required|string|in:email,sms,both',
            'template_id' => 'nullable|integer',
            'recipients_filter' => 'nullable|array',
            'status' => 'nullable|string|in:draft,sending',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'subject.required' => 'El asunto del mensaje es obligatorio.',
            'subject.max' => 'El asunto no puede superar los 255 caracteres.',
            'body.required' => 'El cuerpo del mensaje es obligatorio.',
            'channel.required' => 'El canal de envio es obligatorio.',
            'channel.in' => 'El canal debe ser: email, sms o ambos.',
        ];
    }
}
