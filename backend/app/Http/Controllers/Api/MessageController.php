<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MassMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = MassMessage::with('sender')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'channel' => 'required|string|in:email,sms,both',
            'template_id' => 'nullable|integer',
            'recipients_filter' => 'nullable|array',
            'status' => 'nullable|string|in:draft,sending',
        ]);

        $validated['sender_id'] = $request->user()->id;

        $message = MassMessage::create($validated);

        return response()->json($message->load('sender'), 201);
    }

    public function show(MassMessage $message): JsonResponse
    {
        return response()->json($message->load('sender'));
    }

    public function update(Request $request, MassMessage $message): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'channel' => 'sometimes|string|in:email,sms,both',
            'recipients_filter' => 'nullable|array',
            'status' => 'nullable|string|in:draft,sending,sent',
        ]);

        $message->update($validated);

        return response()->json($message->fresh('sender'));
    }

    public function destroy(MassMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'Mensaje eliminado correctamente.']);
    }

    /** Enviar el mensaje masivo */
    public function send(MassMessage $message): JsonResponse
    {
        // Lógica de envío se implementará con NotificationService
        $message->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return response()->json(['message' => 'Mensaje enviado correctamente.']);
    }
}
