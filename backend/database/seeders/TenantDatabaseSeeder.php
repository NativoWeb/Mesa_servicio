<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class TenantDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'it_leader', 'technician', 'inventory_manager', 'end_user', 'asset_holder'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $admin = User::create([
            'name' => 'Admin Tenant',
            'email' => 'admin@tenant.servicedesk.com',
            'password' => 'password',
            'campus' => 'Principal',
            'department' => 'TI',
        ]);
        $admin->assignRole('admin');

        $user = User::create([
            'name' => 'Usuario Demo',
            'email' => 'usuario@tenant.servicedesk.com',
            'password' => 'password',
            'campus' => 'Principal',
            'department' => 'General',
        ]);
        $user->assignRole('end_user');

        \Illuminate\Support\Facades\DB::table('sla_configs')->insert([
            ['priority' => 'critical', 'response_time_hours' => 1, 'resolution_time_hours' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['priority' => 'high', 'response_time_hours' => 4, 'resolution_time_hours' => 8, 'created_at' => now(), 'updated_at' => now()],
            ['priority' => 'medium', 'response_time_hours' => 8, 'resolution_time_hours' => 24, 'created_at' => now(), 'updated_at' => now()],
            ['priority' => 'low', 'response_time_hours' => 24, 'resolution_time_hours' => 72, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
