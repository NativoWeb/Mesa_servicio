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
            'file' => 'required|file|max:10240',
        ]);

        $attachable = $this->resolveAttachable($type, $id);

        $file = $request->file('file');
        $path = $file->store("attachments/{$type}/{$id}", 'public');

        $attachment = $attachable->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json($attachment->load('user'), 201);
    }

    public function destroy(Attachment $attachment): JsonResponse
    {
        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted'], 200);
    }
}
