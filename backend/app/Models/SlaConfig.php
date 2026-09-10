<?php

namespace App\Models;

use App\Enums\TicketPriority;
use Illuminate\Database\Eloquent\Model;

class SlaConfig extends Model
{
    protected $fillable = [
        'priority',
        'response_time_hours',
        'resolution_time_hours',
    ];

    protected function casts(): array
    {
        return [
            'priority' => TicketPriority::class,
            'response_time_hours' => 'integer',
            'resolution_time_hours' => 'integer',
        ];
    }
}
