<?php

namespace App\Enums;

enum AssetCategory: string
{
    case PC = 'pc';
    case LAPTOP = 'laptop';
    case PRINTER = 'printer';
    case SERVER = 'server';
    case ROUTER = 'router';
    case SWITCH = 'switch';
    case MONITOR = 'monitor';
    case PROJECTOR = 'projector';
    case OTHER = 'other';

    /** Etiqueta legible para el frontend */
    public function label(): string
    {
        return match ($this) {
            self::PC => 'PC de Escritorio',
            self::LAPTOP => 'Portátil',
            self::PRINTER => 'Impresora',
            self::SERVER => 'Servidor',
            self::ROUTER => 'Router',
            self::SWITCH => 'Switch',
            self::MONITOR => 'Monitor',
            self::PROJECTOR => 'Proyector',
            self::OTHER => 'Otro',
        };
    }
}
