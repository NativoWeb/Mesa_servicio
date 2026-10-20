<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

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

    private function authorizeParentAccess(Request $request, $parent): void
    {
        $user = $request->user();
        $role = $user->roles->first()?->name;

        if (in_array($role, ['admin', 'it_leader'])) {
            return;
        }

        if ($parent instanceof Ticket) {
            if ($role === 'inventory_manager') {
                return;
            }
            if (in_array($role, ['end_user', 'asset_holder']) && $parent->requester_id === $user->id) {
                return;
            }
            if ($role === 'technician' && ($parent->assigned_to === $user->id || $parent->requester_id === $user->id)) {
                return;
            }
            throw new AccessDeniedHttpException('No tienes acceso a este recurso.');
        }

        if ($parent instanceof Asset) {
            if (in_array($role, ['inventory_manager', 'technician'])) {
                return;
            }
            if ($role === 'asset_holder' && $parent->holder_id === $user->id) {
                return;
            }
            throw new AccessDeniedHttpException('No tienes acceso a este recurso.');
        }

        if ($parent instanceof Maintenance) {
            if (in_array($role, ['inventory_manager', 'technician'])) {
                return;
            }
            if ($role === 'asset_holder' && $parent->asset?->holder_id === $user->id) {
                return;
            }
            throw new AccessDeniedHttpException('No tienes acceso a este recurso.');
        }

        throw new AccessDeniedHttpException('No tienes acceso a este recurso.');
    }

    public function index(Request $request, string $type, int $id): JsonResponse
    {
        $commentable = $this->resolveCommentable($type, $id);
        $this->authorizeParentAccess($request, $commentable);

        $role = $request->user()->roles->first()?->name;

        $comments = $commentable->comments()
            ->when(in_array($role, ['end_user', 'asset_holder']), fn ($q) => $q->where('is_internal', false))
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
        $this->authorizeParentAccess($request, $commentable);

        $role = $request->user()->roles->first()?->name;
        $isInternal = in_array($role, ['end_user', 'asset_holder']) ? false : ($validated['is_internal'] ?? false);

        $comment = $commentable->comments()->create([
            'body' => $validated['body'],
            'is_internal' => $isInternal,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($comment->load('user'), 201);
    }
}
