<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Mail\MassMessageMail;
use App\Models\MassMessage;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}
    public function index(Request $request): JsonResponse
    {
        $messages = MassMessage::with('sender')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($messages);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['sender_id'] = $request->user()->id;

        $message = MassMessage::create($validated);

        return response()->json($message->load('sender'), 201);
    }

    public function show(MassMessage $message): JsonResponse
    {
        return response()->json($message->load('sender'));
    }

    public function update(UpdateMessageRequest $request, MassMessage $message): JsonResponse
    {
        $validated = $request->validated();

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
        $message->update(['status' => 'sending']);

        try {
            // Construir query de destinatarios según filtros
            $query = User::query();
            $filter = $message->recipients_filter ?? [];

            if (!empty($filter['role'])) {
                $query->role($filter['role']);
            }

            if (!empty($filter['campus'])) {
                $query->where('campus', $filter['campus']);
            }

            $recipients = $query->whereNotNull('email')->pluck('email')->toArray();

            if (empty($recipients)) {
                $message->update(['status' => 'draft']);
                return response()->json(['message' => 'No se encontraron destinatarios con los filtros seleccionados.'], 422);
            }

            // Enviar email a cada destinatario
            $mailable = new MassMessageMail($message);
            Mail::to($recipients)->send($mailable);

            $message->update([
                'status' => 'sent',
                'sent_at' => now(),
                'recipients_count' => count($recipients),
            ]);

            return response()->json(['message' => 'Mensaje enviado correctamente a ' . count($recipients) . ' destinatarios.']);
        } catch (\Throwable $e) {
            Log::error('Error enviando mensaje masivo: ' . $e->getMessage(), [
                'message_id' => $message->id,
            ]);

            $message->update(['status' => 'draft']);

            return response()->json(['message' => 'Error al enviar el mensaje: ' . $e->getMessage()], 500);
        }
    }
}
