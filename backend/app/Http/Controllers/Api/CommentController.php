<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    private function resolveCommentable(string $type, int $id)
    {
        return match ($type) {
            'tickets' => Ticket::findOrFail($id),
            'assets' => Asset::findOrFail($id),
            'maintenances' => Maintenance::findOrFail($id),
        };
    }

    public function index(Request $request, string $type, int $id): JsonResponse
    {
        $commentable = $this->resolveCommentable($type, $id);

        $comments = $commentable->comments()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->paginate($request->per_page ?? 50);

        return response()->json($comments);
    }

    public function store(Request $request, string $type, int $id): JsonResponse
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $commentable = $this->resolveCommentable($type, $id);

        $comment = $commentable->comments()->create([
            'body' => $validated['body'],
            'is_internal' => $validated['is_internal'] ?? false,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($comment->load('user'), 201);
    }
}
