<?php

namespace App\Services;

use App\Models\MassMessage;
use App\Models\Ticket;
use App\Models\User;

/**
 * Servicio centralizado de notificaciones.
 * Gestiona envío de notificaciones por email, SMS y en-app.
 */
class NotificationService
{
    /**
     * Notificar al técnico que se le asignó un ticket.
     */
    public function notifyTicketAssignment(Ticket $ticket): void
    {
        // TODO: Implementar notificación por email/push al técnico asignado
    }

    /**
     * Notificar al solicitante cuando cambia el estado de su ticket.
     */
    public function notifyTicketStatusChange(Ticket $ticket, string $oldStatus): void
    {
        // TODO: Implementar notificación al solicitante
    }

    /**
     * Notificar escalamiento de ticket.
     */
    public function notifyTicketEscalation(Ticket $ticket): void
    {
        // TODO: Implementar notificación al líder de TI
    }

    /**
     * Enviar mensaje masivo a los destinatarios filtrados.
     */
    public function sendMassMessage(MassMessage $message): void
    {
        // TODO: Implementar envío masivo (email/SMS según canal)
        $message->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    /**
     * Notificar vencimiento próximo de SLA.
     */
    public function notifySlaWarning(Ticket $ticket): void
    {
        // TODO: Implementar alerta de SLA próximo a vencer
    }
}
