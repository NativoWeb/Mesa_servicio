<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'channel' => 'sometimes|string|in:email,sms,both',
            'recipients_filter' => 'nullable|array',
            'status' => 'nullable|string|in:draft,sending,sent',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'subject.max' => 'El asunto no puede superar los 255 caracteres.',
            'channel.in' => 'El canal debe ser: email, sms o ambos.',
        ];
    }
}
