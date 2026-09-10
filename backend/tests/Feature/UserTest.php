<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserTest extends TestCase
{
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'technician', 'guard_name' => 'web']);
        Role::create(['name' => 'end_user', 'guard_name' => 'web']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    public function test_listing_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/users');

        $response->assertOk()
            ->assertJsonStructure(['data']);

        // 3 created + 1 admin = 4
        $this->assertGreaterThanOrEqual(4, count($response->json('data')));
    }

    public function test_creating_a_user_with_role_assignment(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/users', [
                'name' => 'Juan Tecnico',
                'email' => 'juan.tecnico@uts.edu.co',
                'password' => 'SecurePass123',
                'phone' => '3001234567',
                'campus' => 'Bucaramanga',
                'department' => 'Sistemas',
                'role' => 'technician',
            ]);

        $response->assertCreated()
            ->assertJsonPath('name', 'Juan Tecnico')
            ->assertJsonPath('email', 'juan.tecnico@uts.edu.co');

        // Verify the role was assigned
        $roles = $response->json('roles');
        $this->assertNotEmpty($roles);
        $this->assertEquals('technician', $roles[0]['name']);

        // Verify user exists in database
        $this->assertDatabaseHas('users', [
            'email' => 'juan.tecnico@uts.edu.co',
            'campus' => 'Bucaramanga',
        ]);
    }

    public function test_updating_a_user(): void
    {
        $user = User::factory()->create([
            'name' => 'Nombre Original',
            'campus' => 'Piedecuesta',
        ]);
        $user->assignRole('end_user');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/users/{$user->id}", [
                'name' => 'Nombre Actualizado',
                'campus' => 'Bucaramanga',
                'role' => 'technician',
            ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Nombre Actualizado')
            ->assertJsonPath('campus', 'Bucaramanga');

        // Verify role was synced
        $roles = $response->json('roles');
        $this->assertNotEmpty($roles);
        $this->assertEquals('technician', $roles[0]['name']);
    }
}
