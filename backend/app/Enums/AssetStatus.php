<?php

namespace App\Enums;

enum AssetStatus: string
{
    case NEW = 'new';
    case OPERATIONAL = 'operational';
    case DAMAGED = 'damaged';
    case DECOMMISSIONED = 'decommissioned';
    case RETIRED = 'retired';

    /** Etiqueta legible para el frontend */
    public function label(): string
    {
        return match ($this) {
            self::NEW => 'Nuevo',
            self::OPERATIONAL => 'Operativo',
            self::DAMAGED => 'Dañado',
            self::DECOMMISSIONED => 'Dado de Baja',
            self::RETIRED => 'Retirado',
        };
    }
}
