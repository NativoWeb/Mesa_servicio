<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Attachment;
use App\Models\Maintenance;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    /**
     * Extensiones permitidas para archivos adjuntos.
     */
    private const ALLOWED_EXTENSIONS = 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,csv,txt,zip';

    /**
     * Tipos MIME permitidos para archivos adjuntos.
     */
    private const ALLOWED_MIMES = 'image/jpeg,image/png,image/gif,application/pdf,'
        . 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,'
        . 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,'
        . 'text/csv,text/plain,application/zip';

    private function resolveAttachable(string $type, int $id)
    {
        return match ($type) {
            'tickets' => Ticket::findOrFail($id),
            'assets' => Asset::findOrFail($id),
            'maintenances' => Maintenance::findOrFail($id),
        };
    }

    public function index(Request $request, string $type, int $id): JsonResponse
    {
        $attachable = $this->resolveAttachable($type, $id);

        $attachments = $attachable->attachments()
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 50);

        return response()->json($attachments);
    }

    public function store(Request $request, string $type, int $id): JsonResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240', // 10 MB
                'mimes:' . self::ALLOWED_EXTENSIONS,
            ],
        ], [
            'file.max' => 'El archivo no debe superar los 10 MB.',
            'file.mimes' => 'Tipo de archivo no permitido. Extensiones válidas: ' . self::ALLOWED_EXTENSIONS . '.',
        ]);

        $attachable = $this->resolveAttachable($type, $id);

        $file = $request->file('file');

        // Guardar organizado por tipo de entidad e ID: tickets/5/, assets/12/, etc.
        $directory = "{$type}/{$id}";
        $storedPath = $file->store($directory, 'attachments');

        $attachment = $attachable->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $storedPath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'user_id' => $request->user()->id,
        ]);

        $attachment->load('user');

        // Incluir URL de descarga en la respuesta
        $attachment->download_url = route('attachments.download', $attachment);

        return response()->json($attachment, 201);
    }

    /**
     * Descargar un archivo adjunto.
     */
    public function download(Attachment $attachment)
    {
        if (! Storage::disk('attachments')->exists($attachment->file_path)) {
            return response()->json(['message' => 'Archivo no encontrado.'], 404);
        }

        return Storage::disk('attachments')->download(
            $attachment->file_path,
            $attachment->file_name
        );
    }

    public function destroy(Attachment $attachment): JsonResponse
    {
        Storage::disk('attachments')->delete($attachment->file_path);
        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted'], 200);
    }
}
