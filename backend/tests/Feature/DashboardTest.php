<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'it_leader', 'guard_name' => 'web']);
        Role::create(['name' => 'technician', 'guard_name' => 'web']);
        Role::create(['name' => 'end_user', 'guard_name' => 'web']);
        Role::create(['name' => 'inventory_manager', 'guard_name' => 'web']);
        Role::create(['name' => 'asset_holder', 'guard_name' => 'web']);
    }

    // --- Auth ---

    public function test_dashboard_requires_auth(): void
    {
        $this->getJson('/api/dashboard')
            ->assertUnauthorized();
    }

    // --- Admin dashboard ---

    public function test_admin_dashboard_returns_base_data(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'tickets' => ['by_status', 'by_priority', 'total'],
                'assets' => ['by_category', 'by_status', 'total'],
                'maintenances' => ['by_type', 'by_status', 'total'],
                'users' => ['total'],
            ]);
    }

    public function test_admin_sees_extended_data(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Create test data
        $endUser = User::factory()->create();
        $endUser->assignRole('end_user');

        Ticket::create([
            'title' => 'Ticket de prueba',
            'description' => 'Desc',
            'priority' => 'high',
            'status' => 'open',
            'requester_id' => $endUser->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'tickets_by_priority',
                'tickets_weekly',
                'technician_workload',
                'sla_compliance' => ['rate', 'met', 'breached', 'total'],
                'unassigned_tickets',
            ]);
    }

    public function test_admin_sees_correct_ticket_counts(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $requester = User::factory()->create();
        $requester->assignRole('end_user');

        // Create tickets with different statuses
        Ticket::create([
            'title' => 'Ticket abierto 1',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $requester->id,
        ]);

        Ticket::create([
            'title' => 'Ticket abierto 2',
            'description' => 'Desc',
            'priority' => 'high',
            'status' => 'open',
            'requester_id' => $requester->id,
        ]);

        Ticket::create([
            'title' => 'Ticket cerrado',
            'description' => 'Desc',
            'priority' => 'medium',
            'status' => 'closed',
            'requester_id' => $requester->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk();
        $this->assertEquals(3, $response->json('tickets.total'));
    }

    // --- Technician dashboard ---

    public function test_technician_sees_my_tickets_data(): void
    {
        $technician = User::factory()->create();
        $technician->assignRole('technician');

        $requester = User::factory()->create();
        $requester->assignRole('end_user');

        // Tickets assigned to this technician
        Ticket::create([
            'title' => 'Ticket asignado 1',
            'description' => 'Desc',
            'priority' => 'high',
            'status' => 'open',
            'requester_id' => $requester->id,
            'assigned_to' => $technician->id,
        ]);

        Ticket::create([
            'title' => 'Ticket asignado 2',
            'description' => 'Desc',
            'priority' => 'medium',
            'status' => 'in_progress',
            'requester_id' => $requester->id,
            'assigned_to' => $technician->id,
        ]);

        // Ticket NOT assigned to this technician
        $otherTech = User::factory()->create();
        $otherTech->assignRole('technician');

        Ticket::create([
            'title' => 'Ticket de otro tecnico',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $requester->id,
            'assigned_to' => $otherTech->id,
        ]);

        $response = $this->actingAs($technician, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'my_tickets' => ['open', 'in_progress', 'pending', 'closed_today'],
            ]);

        // Technician should see only their own ticket counts
        $this->assertEquals(1, $response->json('my_tickets.open'));
        $this->assertEquals(1, $response->json('my_tickets.in_progress'));
        $this->assertEquals(0, $response->json('my_tickets.pending'));
    }

    // --- End user dashboard ---

    public function test_end_user_sees_my_tickets_data(): void
    {
        $endUser = User::factory()->create();
        $endUser->assignRole('end_user');

        // Tickets created by this user
        Ticket::create([
            'title' => 'Mi ticket abierto',
            'description' => 'Desc',
            'priority' => 'medium',
            'status' => 'open',
            'requester_id' => $endUser->id,
        ]);

        Ticket::create([
            'title' => 'Mi ticket cerrado',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'closed',
            'requester_id' => $endUser->id,
        ]);

        // Ticket from another user (should NOT count)
        $otherUser = User::factory()->create();
        $otherUser->assignRole('end_user');

        Ticket::create([
            'title' => 'Ticket de otro usuario',
            'description' => 'Desc',
            'priority' => 'high',
            'status' => 'open',
            'requester_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($endUser, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'my_tickets' => ['open', 'in_progress', 'closed'],
            ]);

        $this->assertEquals(1, $response->json('my_tickets.open'));
        $this->assertEquals(0, $response->json('my_tickets.in_progress'));
        $this->assertEquals(1, $response->json('my_tickets.closed'));
    }

    // --- Inventory manager dashboard ---

    public function test_inventory_manager_sees_assets_detail(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('inventory_manager');

        Asset::create([
            'name' => 'Laptop 1',
            'category' => 'laptop',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'Laptop 2',
            'category' => 'laptop',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'PC danado',
            'category' => 'pc',
            'status' => 'damaged',
        ]);

        $response = $this->actingAs($manager, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'assets_detail' => [
                    'total', 'operational', 'damaged',
                    'in_maintenance', 'pending_maintenance',
                ],
            ]);

        $this->assertEquals(3, $response->json('assets_detail.total'));
        $this->assertEquals(2, $response->json('assets_detail.operational'));
        $this->assertEquals(1, $response->json('assets_detail.damaged'));
    }

    // --- IT Leader dashboard ---

    public function test_it_leader_sees_extended_data(): void
    {
        $leader = User::factory()->create();
        $leader->assignRole('it_leader');

        $response = $this->actingAs($leader, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'tickets_by_priority',
                'tickets_weekly',
                'technician_workload',
                'sla_compliance',
            ]);
    }

    // --- Asset holder dashboard ---

    public function test_asset_holder_sees_my_assets(): void
    {
        $holder = User::factory()->create();
        $holder->assignRole('asset_holder');

        Asset::create([
            'name' => 'Mi laptop',
            'category' => 'laptop',
            'status' => 'operational',
            'holder_id' => $holder->id,
        ]);

        Asset::create([
            'name' => 'Mi monitor danado',
            'category' => 'monitor',
            'status' => 'damaged',
            'holder_id' => $holder->id,
        ]);

        // Asset of another holder
        $otherHolder = User::factory()->create();
        $otherHolder->assignRole('asset_holder');

        Asset::create([
            'name' => 'Asset de otro',
            'category' => 'pc',
            'status' => 'operational',
            'holder_id' => $otherHolder->id,
        ]);

        $response = $this->actingAs($holder, 'sanctum')
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'my_assets' => ['total', 'damaged', 'maintenance_this_month'],
            ]);

        $this->assertEquals(2, $response->json('my_assets.total'));
        $this->assertEquals(1, $response->json('my_assets.damaged'));
    }
}
