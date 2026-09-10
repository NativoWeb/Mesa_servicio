<?php

namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Ticket $ticket, public string $action) {}

    public function broadcastOn(): array
    {
        $channels = [new Channel('tickets')];
        if ($this->ticket->assigned_to) {
            $channels[] = new Channel('user.' . $this->ticket->assigned_to);
        }
        if ($this->ticket->requester_id) {
            $channels[] = new Channel('user.' . $this->ticket->requester_id);
        }
        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'ticket.updated';
    }
}
