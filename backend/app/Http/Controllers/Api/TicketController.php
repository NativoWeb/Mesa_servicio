<?php

namespace App\Http\Controllers\Api;

use App\Events\TicketUpdated;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\NotificationService;
use App\Services\SlaService;
use App\Services\TicketAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(
        private readonly SlaService $slaService,
        private readonly TicketAssignmentService $assignmentService,
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tickets = Ticket::with(['requester', 'assignedUser'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn ($q, $priority) => $q->where('priority', $priority))
            ->when($request->assigned_to, fn ($q, $id) => $q->where('assigned_to', $id))
            ->when($request->search, fn ($q, $search) => $q->where('title', 'ilike', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:100',
            'priority' => 'required|string|in:low,medium,high,critical',
            'campus' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
        ]);

        $validated['requester_id'] = $request->user()->id;
        $validated['status'] = 'open';

        $ticket = Ticket::create($validated);

        // Calcular deadline SLA según la prioridad del ticket
        $this->slaService->calculateDeadline($ticket);

        // Intentar asignación automática a un técnico disponible
        $assignedTechnician = $this->assignmentService->autoAssign($ticket);
        if ($assignedTechnician) {
            $ticket->update(['status' => 'in_progress']);
            $this->notificationService->notifyTicketAssignment($ticket->fresh('assignedUser'));
        }

        $ticket = $ticket->fresh(['requester', 'assignedUser']);

        TicketUpdated::dispatch($ticket, 'created');

        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        return response()->json(
            $ticket->load(['requester', 'assignedUser', 'escalatedUser', 'comments.user', 'attachments', 'events.user'])
        );
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
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
        ]);

        $oldStatus = $ticket->status->value;

        $ticket->update($validated);
        $ticket = $ticket->fresh(['requester', 'assignedUser']);

        // Notificar cambio de estado
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            $this->notificationService->notifyTicketStatusChange($ticket, $oldStatus);

            // Si fue escalado, notificar a lideres TI
            if ($validated['status'] === 'escalated') {
                $this->notificationService->notifyTicketEscalation($ticket);
            }
        }

        // Notificar asignacion si cambio el tecnico
        if (isset($validated['assigned_to']) && $ticket->assigned_to) {
            $this->notificationService->notifyTicketAssignment($ticket);
        }

        TicketUpdated::dispatch($ticket, 'updated');

        return response()->json($ticket);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        $ticket->delete();

        return response()->json(['message' => 'Ticket eliminado correctamente.']);
    }
}
