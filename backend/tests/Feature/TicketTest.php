<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TicketTest extends TestCase
{
    private User $admin;
    private User $endUser;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'technician', 'guard_name' => 'web']);
        Role::create(['name' => 'end_user', 'guard_name' => 'web']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->endUser = User::factory()->create();
        $this->endUser->assignRole('end_user');
    }

    // --- Auth ---

    public function test_listing_tickets_requires_auth(): void
    {
        $this->getJson('/api/tickets')
            ->assertUnauthorized();
    }

    public function test_creating_ticket_requires_auth(): void
    {
        $this->postJson('/api/tickets', [
            'title' => 'Test',
            'description' => 'Test',
            'priority' => 'low',
        ])->assertUnauthorized();
    }

    // --- Create ---

    public function test_creating_a_ticket_with_valid_data(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Equipo no enciende',
                'description' => 'El computador del laboratorio 3 no enciende desde ayer.',
                'priority' => 'high',
                'category' => 'hardware',
                'campus' => 'Bucaramanga',
                'location' => 'Laboratorio 3',
            ]);

        $response->assertCreated()
            ->assertJsonPath('title', 'Equipo no enciende')
            ->assertJsonPath('priority', 'high')
            ->assertJsonPath('requester_id', $this->admin->id);

        $this->assertDatabaseHas('tickets', [
            'title' => 'Equipo no enciende',
            'priority' => 'high',
        ]);
    }

    public function test_ticket_gets_open_status_on_creation(): void
    {
        $response = $this->actingAs($this->endUser, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Ticket nuevo',
                'description' => 'Descripcion del ticket',
                'priority' => 'medium',
            ]);

        $response->assertCreated();

        // Status might be 'open' or 'in_progress' if auto-assigned
        $status = $response->json('status');
        $this->assertContains($status, ['open', 'in_progress']);
    }

    public function test_ticket_number_is_auto_generated(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Primer ticket',
                'description' => 'Descripcion',
                'priority' => 'low',
            ]);

        $response->assertCreated();
        $ticketNumber = $response->json('ticket_number');
        $this->assertNotNull($ticketNumber);
        $this->assertStringStartsWith('T-', $ticketNumber);
    }

    public function test_creating_ticket_requires_title(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tickets', [
                'description' => 'Sin titulo',
                'priority' => 'low',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_creating_ticket_requires_description(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Sin descripcion',
                'priority' => 'low',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('description');
    }

    public function test_creating_ticket_requires_valid_priority(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Ticket test',
                'description' => 'Desc',
                'priority' => 'invalid_priority',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('priority');
    }

    public function test_creating_ticket_sets_requester_to_current_user(): void
    {
        $response = $this->actingAs($this->endUser, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Mi ticket',
                'description' => 'Creado por end_user',
                'priority' => 'medium',
            ]);

        $response->assertCreated()
            ->assertJsonPath('requester_id', $this->endUser->id);
    }

    // --- Read ---

    public function test_show_ticket_detail(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket de prueba',
            'description' => 'Descripcion detallada',
            'priority' => 'high',
            'status' => 'open',
            'requester_id' => $this->admin->id,
            'campus' => 'Bucaramanga',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/tickets/{$ticket->id}");

        $response->assertOk()
            ->assertJsonPath('id', $ticket->id)
            ->assertJsonPath('title', 'Ticket de prueba')
            ->assertJsonPath('priority', 'high')
            ->assertJsonStructure([
                'id', 'ticket_number', 'title', 'description',
                'priority', 'status', 'requester_id',
                'requester', 'comments', 'attachments',
            ]);
    }

    public function test_listing_tickets_returns_paginated_data(): void
    {
        // Create multiple tickets
        for ($i = 0; $i < 3; $i++) {
            Ticket::create([
                'title' => "Ticket {$i}",
                'description' => "Descripcion {$i}",
                'priority' => 'low',
                'status' => 'open',
                'requester_id' => $this->admin->id,
            ]);
        }

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/tickets');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'current_page',
                'per_page',
                'total',
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    // --- Update ---

    public function test_updating_a_ticket(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket original',
            'description' => 'Descripcion original',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/tickets/{$ticket->id}", [
                'title' => 'Ticket actualizado',
                'status' => 'in_progress',
            ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Ticket actualizado')
            ->assertJsonPath('status', 'in_progress');

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'title' => 'Ticket actualizado',
            'status' => 'in_progress',
        ]);
    }

    public function test_updating_ticket_priority(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket prioridad',
            'description' => 'Test',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/tickets/{$ticket->id}", [
                'priority' => 'critical',
            ]);

        $response->assertOk()
            ->assertJsonPath('priority', 'critical');
    }

    public function test_assigning_ticket_to_technician(): void
    {
        $technician = User::factory()->create();
        $technician->assignRole('technician');

        $ticket = Ticket::create([
            'title' => 'Ticket sin asignar',
            'description' => 'Necesita tecnico',
            'priority' => 'medium',
            'status' => 'open',
            'requester_id' => $this->endUser->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/tickets/{$ticket->id}", [
                'assigned_to' => $technician->id,
                'status' => 'in_progress',
            ]);

        $response->assertOk()
            ->assertJsonPath('assigned_to', $technician->id)
            ->assertJsonPath('status', 'in_progress');
    }

    // --- Delete (soft delete) ---

    public function test_deleting_a_ticket_soft_deletes(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket para eliminar',
            'description' => 'Se eliminara con soft delete',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Ticket eliminado correctamente.');

        // Should be soft-deleted (exists in DB with deleted_at)
        $this->assertSoftDeleted('tickets', ['id' => $ticket->id]);

        // Should not appear in normal queries
        $this->assertNull(Ticket::find($ticket->id));
        $this->assertNotNull(Ticket::withTrashed()->find($ticket->id));
    }

    // --- Filters ---

    public function test_filtering_tickets_by_status(): void
    {
        Ticket::create([
            'title' => 'Ticket abierto',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        Ticket::create([
            'title' => 'Ticket cerrado',
            'description' => 'Desc',
            'priority' => 'medium',
            'status' => 'closed',
            'requester_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/tickets?status=open');

        $response->assertOk();

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $ticket) {
            $this->assertEquals('open', $ticket['status']);
        }
    }

    public function test_filtering_tickets_by_priority(): void
    {
        Ticket::create([
            'title' => 'Ticket critico',
            'description' => 'Desc',
            'priority' => 'critical',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        Ticket::create([
            'title' => 'Ticket bajo',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/tickets?priority=critical');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('critical', $data[0]['priority']);
    }
}
