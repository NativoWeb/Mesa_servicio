<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Shift;
use App\Enums\UserRole;

/**
 * Servicio para la asignación automática de tickets a técnicos.
 * Considera disponibilidad, carga de trabajo y turnos activos.
 */
class TicketAssignmentService
{
    /**
     * Asignar automáticamente un técnico al ticket según disponibilidad y carga.
     */
    public function autoAssign(Ticket $ticket): ?User
    {
        // Buscar técnicos con turno activo en la misma sede
        $availableTechnicians = User::role(UserRole::TECHNICIAN->value)
            ->whereHas('shifts', function ($query) use ($ticket) {
                $query->where('status', 'active')
                    ->whereDate('date', now()->toDateString());

                if ($ticket->campus) {
                    $query->where('campus', $ticket->campus);
                }
            })
            ->withCount(['assignedTickets' => function ($query) {
                $query->whereNotIn('status', ['closed']);
            }])
            ->orderBy('assigned_tickets_count', 'asc')
            ->first();

        if ($availableTechnicians) {
            $ticket->update(['assigned_to' => $availableTechnicians->id]);
            return $availableTechnicians;
        }

        return null;
    }

    /**
     * Reasignar un ticket a otro técnico.
     */
    public function reassign(Ticket $ticket, User $technician): void
    {
        $ticket->update(['assigned_to' => $technician->id]);
    }
}
