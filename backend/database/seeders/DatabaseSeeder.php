<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear roles
        $roles = ['admin', 'it_leader', 'technician', 'inventory_manager', 'end_user', 'asset_holder'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Usuarios de prueba (uno por rol)
        $users = [
            [
                'name' => 'Admin Sistema',
                'email' => 'admin@uts.edu.co',
                'password' => 'password',
                'campus' => 'Global',
                'department' => 'TI Central',
                'role' => 'admin',
            ],
            [
                'name' => 'Carlos Mejía',
                'email' => 'lider@uts.edu.co',
                'password' => 'password',
                'campus' => 'Bucaramanga (Principal)',
                'department' => 'Dirección TI',
                'role' => 'it_leader',
            ],
            [
                'name' => 'Andrés Gómez',
                'email' => 'tecnico@uts.edu.co',
                'password' => 'password',
                'campus' => 'Bucaramanga (Principal)',
                'department' => 'Soporte TI',
                'role' => 'technician',
            ],
            [
                'name' => 'Martha Rueda',
                'email' => 'inventario@uts.edu.co',
                'password' => 'password',
                'campus' => 'Bucaramanga (Principal)',
                'department' => 'Gestión de Activos',
                'role' => 'inventory_manager',
            ],
            [
                'name' => 'Juan Pérez',
                'email' => 'usuario@uts.edu.co',
                'password' => 'password',
                'campus' => 'Bucaramanga (Principal)',
                'department' => 'Facultad de Ingeniería',
                'role' => 'end_user',
            ],
            [
                'name' => 'Laura Pineda',
                'email' => 'cuentadante@uts.edu.co',
                'password' => 'password',
                'campus' => 'Piedecuesta',
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
