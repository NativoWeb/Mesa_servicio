<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'it_leader', 'technician', 'inventory_manager', 'end_user', 'asset_holder'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $users = [
            [
                'name' => 'Admin Sistema',
                'email' => 'admin@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Global',
                'department' => 'TI Central',
                'role' => 'admin',
            ],
            [
                'name' => 'Carlos Mejía',
                'email' => 'lider@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Sede Central',
                'department' => 'Dirección TI',
                'role' => 'it_leader',
            ],
            [
                'name' => 'Andrés Gómez',
                'email' => 'tecnico@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Sede Central',
                'department' => 'Soporte TI',
                'role' => 'technician',
            ],
            [
                'name' => 'Martha Rueda',
                'email' => 'inventario@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Sede Central',
                'department' => 'Gestión de Activos',
                'role' => 'inventory_manager',
            ],
            [
                'name' => 'Juan Pérez',
                'email' => 'usuario@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Sede Central',
                'department' => 'Recursos Humanos',
                'role' => 'end_user',
            ],
            [
                'name' => 'Laura Pineda',
                'email' => 'cuentadante@demo.servicedesk.com',
                'password' => 'password',
                'campus' => 'Sede Norte',
                'department' => 'Coordinación Académica',
                'role' => 'asset_holder',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            $user->assignRole($role);
        }

        // --- Tenant UTS por defecto ---
        if (Tenant::count() === 0) {
            $tenant = Tenant::create([
                'id' => 'uts',
                'name' => 'Unidades Tecnológicas de Santander',
                'short_name' => 'UTS',
                'branding' => [
                    'primary' => '#1B5E20',
                    'primary_light' => '#4CAF50',
                    'primary_dark' => '#0D3B0D',
                    'accent' => '#F9A825',
                    'sidebar_from' => '#1B3A1B',
                    'sidebar_to' => '#2E5A2E',
                    'background' => '#FAFAFA',
                    'card' => '#FFFFFF',
                    'text_primary' => '#1A1A1A',
                    'text_secondary' => '#6B7280',
                ],
                'features' => [
                    'tickets' => true,
                    'inventory' => true,
                    'maintenance' => true,
                    'mass_messaging' => true,
                    'shifts' => true,
                    'reports' => true,
                    'sla' => true,
                    'audit_logs' => true,
                ],
                'campuses' => [
                    'Bucaramanga',
                    'Piedecuesta',
                    'Barrancabermeja',
                    'Yopal',
                    'Vélez',
                    'Charalá',
                ],
                'ticket_categories' => [
                    'Hardware',
                    'Software',
                    'Redes e Infraestructura',
                    'Correo Electrónico',
                    'Soporte Web',
                    'Accesos y Permisos',
                    'Impresoras',
                    'Telefonía',
                    'Otro',
                ],
                'timezone' => 'America/Bogota',
            ]);

            $tenant->domains()->create(['domain' => 'localhost']);
            $tenant->domains()->create(['domain' => '127.0.0.1']);
        }
    }
}
