<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TicketTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'technician', 'guard_name' => 'web']);

        $this->user = User::factory()->create();
        $this->user->assignRole('admin');
    }

    public function test_listing_tickets_requires_auth(): void
    {
        $this->getJson('/api/tickets')
            ->assertUnauthorized();
    }

    public function test_creating_a_ticket_with_valid_data(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
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
            ->assertJsonPath('status', 'open')
            ->assertJsonPath('requester_id', $this->user->id);

        $this->assertDatabaseHas('tickets', [
            'title' => 'Equipo no enciende',
            'priority' => 'high',
        ]);
    }

    public function test_updating_a_ticket(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket original',
            'description' => 'Descripcion original',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/tickets/{$ticket->id}", [
                'title' => 'Ticket actualizado',
                'status' => 'in_progress',
            ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Ticket actualizado')
            ->assertJsonPath('status', 'in_progress');
    }

    public function test_deleting_a_ticket_soft_deletes(): void
    {
        $ticket = Ticket::create([
            'title' => 'Ticket para eliminar',
            'description' => 'Se eliminara con soft delete',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Ticket eliminado correctamente.');

        // Should be soft-deleted (exists in DB with deleted_at)
        $this->assertSoftDeleted('tickets', ['id' => $ticket->id]);
    }

    public function test_filtering_tickets_by_status(): void
    {
        Ticket::create([
            'title' => 'Ticket abierto',
            'description' => 'Desc',
            'priority' => 'low',
            'status' => 'open',
            'requester_id' => $this->user->id,
        ]);

        Ticket::create([
            'title' => 'Ticket cerrado',
            'description' => 'Desc',
            'priority' => 'medium',
            'status' => 'closed',
            'requester_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/tickets?status=open');

        $response->assertOk();

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $ticket) {
            $this->assertEquals('open', $ticket['status']);
        }
    }
}
