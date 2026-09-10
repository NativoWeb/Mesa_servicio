<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case IT_LEADER = 'it_leader';
    case TECHNICIAN = 'technician';
    case INVENTORY_MANAGER = 'inventory_manager';
    case END_USER = 'end_user';
    case ASSET_HOLDER = 'asset_holder';

    /** Etiqueta legible para el frontend */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrador',
            self::IT_LEADER => 'Líder de TI',
            self::TECHNICIAN => 'Técnico',
            self::INVENTORY_MANAGER => 'Gestor de Inventario',
            self::END_USER => 'Usuario Final',
            self::ASSET_HOLDER => 'Cuentadante',
        };
    }
}
