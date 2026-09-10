<?php

namespace App\Enums;

enum TicketStatus: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case PENDING = 'pending';
    case ESCALATED = 'escalated';
    case CLOSED = 'closed';

    /** Etiqueta legible para el frontend */
    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Abierto',
            self::IN_PROGRESS => 'En Progreso',
            self::PENDING => 'Pendiente',
            self::ESCALATED => 'Escalado',
            self::CLOSED => 'Cerrado',
        };
    }
}
