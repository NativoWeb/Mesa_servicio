<?php

namespace Database\Seeders;

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
    }
}
