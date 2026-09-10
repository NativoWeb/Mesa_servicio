<?php

namespace App\Services;

use App\Models\MassMessage;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Servicio centralizado de notificaciones.
 * Gestiona envio de notificaciones por email.
 */
class NotificationService
{
    /**
     * Notificar al tecnico que se le asigno un ticket.
     */
    public function notifyTicketAssignment(Ticket $ticket): void
    {
        $technician = $ticket->assignedUser;

        if (!$technician || !$technician->email) {
            return;
        }

        try {
            $subject = "Ticket #{$ticket->ticket_number} asignado a ti";
            $body = "Hola {$technician->name},\n\n"
                . "Se te ha asignado el ticket #{$ticket->ticket_number}.\n\n"
                . "Asunto: {$ticket->title}\n"
                . "Prioridad: {$ticket->priority->value}\n"
                . "Categoria: {$ticket->category}\n"
                . "Sede: {$ticket->campus}\n\n"
                . "Por favor atiende este caso a la brevedad.";

            Mail::raw($body, function ($m) use ($technician, $subject) {
                $m->to($technician->email)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::error('Error al notificar asignacion de ticket: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
                'technician_id' => $technician->id,
            ]);
        }
    }

    /**
     * Notificar al solicitante cuando cambia el estado de su ticket.
     */
    public function notifyTicketStatusChange(Ticket $ticket, string $oldStatus): void
    {
        $requester = $ticket->requester;

        if (!$requester || !$requester->email) {
            return;
        }

        try {
            $newStatus = $ticket->status->value;
            $subject = "Ticket #{$ticket->ticket_number} - Estado actualizado";
            $body = "Hola {$requester->name},\n\n"
                . "El estado de tu ticket #{$ticket->ticket_number} ha cambiado.\n\n"
                . "Estado anterior: {$oldStatus}\n"
                . "Estado actual: {$newStatus}\n"
                . "Asunto: {$ticket->title}\n\n"
                . "Puedes consultar el detalle en la plataforma.";

            Mail::raw($body, function ($m) use ($requester, $subject) {
                $m->to($requester->email)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::error('Error al notificar cambio de estado: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
            ]);
        }
    }

    /**
     * Notificar escalamiento de ticket a los lideres TI.
     */
    public function notifyTicketEscalation(Ticket $ticket): void
    {
        try {
            $leaders = User::role('it_leader')
                ->whereNotNull('email')
                ->pluck('email')
                ->toArray();

            if (empty($leaders)) {
                return;
            }

            $subject = "Ticket #{$ticket->ticket_number} ESCALADO";
            $body = "Se ha escalado el ticket #{$ticket->ticket_number}.\n\n"
                . "Asunto: {$ticket->title}\n"
                . "Prioridad: {$ticket->priority->value}\n"
                . "Razon de escalamiento: {$ticket->escalation_reason}\n"
                . "Sede: {$ticket->campus}\n\n"
                . "Por favor revisa este caso.";

            Mail::raw($body, function ($m) use ($leaders, $subject) {
                $m->to($leaders)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::error('Error al notificar escalamiento: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
            ]);
        }
    }

    /**
     * Notificar vencimiento proximo de SLA al tecnico asignado y lideres TI.
     */
    public function notifySlaWarning(Ticket $ticket): void
    {
        try {
            $recipients = [];

            // Tecnico asignado
            $technician = $ticket->assignedUser;
            if ($technician && $technician->email) {
                $recipients[] = $technician->email;
            }

            // Lideres TI
            $leaders = User::role('it_leader')
                ->whereNotNull('email')
                ->pluck('email')
                ->toArray();

            $recipients = array_unique(array_merge($recipients, $leaders));

            if (empty($recipients)) {
                return;
            }

            $deadline = $ticket->sla_deadline?->format('d/m/Y H:i') ?? 'No definido';
            $subject = "ALERTA SLA - Ticket #{$ticket->ticket_number} proximo a vencer";
            $body = "El ticket #{$ticket->ticket_number} esta proximo a vencer su SLA.\n\n"
                . "Asunto: {$ticket->title}\n"
                . "Prioridad: {$ticket->priority->value}\n"
                . "Fecha limite SLA: {$deadline}\n"
                . "Sede: {$ticket->campus}\n\n"
                . "Atiende este caso de inmediato para cumplir con el SLA.";

            Mail::raw($body, function ($m) use ($recipients, $subject) {
                $m->to($recipients)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::error('Error al notificar alerta SLA: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
            ]);
        }
    }

    /**
     * Enviar mensaje masivo a los destinatarios filtrados.
     */
    public function sendMassMessage(MassMessage $message): void
    {
        // La logica de envio masivo esta en MessageController::send
        $message->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }
}
