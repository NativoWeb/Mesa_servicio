<?php

namespace App\Enums;

enum MaintenanceType: string
{
    case PREVENTIVE = 'preventive';
    case CORRECTIVE = 'corrective';
    case UPDATE = 'update';
    case CLEANING = 'cleaning';

    /** Etiqueta legible para el frontend */
    public function label(): string
    {
        return match ($this) {
            self::PREVENTIVE => 'Preventivo',
            self::CORRECTIVE => 'Correctivo',
            self::UPDATE => 'Actualización',
            self::CLEANING => 'Limpieza',
        };
    }
}
