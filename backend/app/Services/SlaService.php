<?php

namespace App\Services;

use App\Models\SlaConfig;
use App\Models\Ticket;
use App\Enums\TicketPriority;
use Carbon\Carbon;

/**
 * Servicio para gestionar los SLA (Acuerdos de Nivel de Servicio).
 * Calcula deadlines y verifica cumplimiento.
 */
class SlaService
{
    /**
     * Calcular y asignar el deadline SLA al ticket según su prioridad.
     */
    public function calculateDeadline(Ticket $ticket): ?Carbon
    {
        $config = SlaConfig::where('priority', $ticket->priority->value)->first();

        if (! $config) {
            return null;
        }

        $deadline = $ticket->created_at->addHours($config->resolution_time_hours);
        $ticket->update(['sla_deadline' => $deadline]);

        return $deadline;
    }

    /**
     * Verificar si un ticket ha excedido su SLA.
     */
    public function isBreached(Ticket $ticket): bool
    {
        if (! $ticket->sla_deadline) {
            return false;
        }

        return now()->greaterThan($ticket->sla_deadline)
            && ! in_array($ticket->status->value, ['closed']);
    }

    /**
     * Obtener el tiempo restante para cumplir el SLA (en minutos).
     */
    public function remainingMinutes(Ticket $ticket): ?int
    {
        if (! $ticket->sla_deadline) {
            return null;
        }

        return (int) now()->diffInMinutes($ticket->sla_deadline, false);
    }
}
