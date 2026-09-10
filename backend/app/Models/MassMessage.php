<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MassMessage extends Model
{
    protected $fillable = [
        'sender_id',
        'subject',
        'body',
        'channel',
        'template_id',
        'recipients_filter',
        'recipients_count',
        'status',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'recipients_filter' => 'array',
            'recipients_count' => 'integer',
            'sent_at' => 'datetime',
        ];
    }

    // --- Relaciones ---

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
