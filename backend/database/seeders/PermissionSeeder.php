<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    private const SYSTEM_ROLES = [
        'admin', 'it_leader', 'technician',
        'inventory_manager', 'end_user', 'asset_holder',
    ];

    private const PERMISSIONS = [
        // Tickets
        'tickets.view_all',
        'tickets.view_own',
        'tickets.create',
        'tickets.update',
        'tickets.delete',
        'tickets.assign',
        'tickets.escalate',
        // Assets
        'assets.view_all',
        'assets.view_own',
        'assets.create',
        'assets.update',
        'assets.delete',
        // Maintenances
        'maintenances.view_all',
        'maintenances.view_own',
        'maintenances.create',
        'maintenances.update',
        'maintenances.delete',
        // Users
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        // Reports
        'reports.view',
        'reports.export',
        // System
        'roles.manage',
        'config.manage',
        'audit.view',
        'sla.manage',
        'messages.send',
        'shifts.view',
        'shifts.manage',
        'comments.internal',
    ];

    private const ROLE_PERMISSIONS = [
        'it_leader' => [
            'tickets.view_all', 'tickets.update', 'tickets.assign', 'tickets.escalate',
            'reports.view', 'reports.export', 'messages.send',
            'users.view', 'comments.internal', 'shifts.view',
        ],
        'technician' => [
            'tickets.view_own', 'tickets.update',
            'assets.view_all', 'comments.internal', 'shifts.view',
        ],
        'inventory_manager' => [
            'assets.view_all', 'assets.create', 'assets.update', 'assets.delete',
            'maintenances.view_all', 'maintenances.create', 'maintenances.update', 'maintenances.delete',
            'reports.view', 'reports.export', 'users.view',
        ],
        'end_user' => [
            'tickets.view_own', 'tickets.create',
        ],
        'asset_holder' => [
            'assets.view_own', 'maintenances.view_own',
        ],
    ];

    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $descriptions = [
            'admin' => 'Acceso total al sistema, configuración de parámetros, gestión de usuarios y roles.',
            'it_leader' => 'Dashboard global, reasignación y escalamiento de tickets, reportes y mensajería masiva.',
            'technician' => 'Gestión de tickets asignados, equipos vinculados y consulta de turnos.',
            'inventory_manager' => 'CRUD completo de activos, registro de mantenimientos y gestión de cuentadantes.',
            'end_user' => 'Crear y consultar tickets propios, recibir notificaciones de estado.',
            'asset_holder' => 'Consultar equipos bajo su custodia, hoja de vida y alertas de mantenimiento.',
        ];

        foreach (self::SYSTEM_ROLES as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);

            $updates = [];
            if (! $role->is_system) {
                $updates['is_system'] = true;
            }
            if (! $role->description && isset($descriptions[$roleName])) {
                $updates['description'] = $descriptions[$roleName];
            }
            if ($updates) {
                $role->update($updates);
            }
        }

        // admin gets ALL permissions
        $admin = Role::findByName('admin', 'web');
        $admin->syncPermissions(self::PERMISSIONS);

        // Other roles get their specific permissions
        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::findByName($roleName, 'web');
            $role->syncPermissions($permissions);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
