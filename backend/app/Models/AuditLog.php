<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Modelo wrapper para consultas de auditoría.
 * La tabla real es gestionada por spatie/laravel-activitylog (activity_log).
 */
class AuditLog extends Model
{
    protected $table = 'activity_log';

    protected $fillable = [];

    protected $casts = [
        'properties' => 'array',
    ];

    public function causer(): MorphTo
    {
        return $this->morphTo();
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
