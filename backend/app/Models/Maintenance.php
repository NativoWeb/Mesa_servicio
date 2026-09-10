<?php

namespace App\Models;

use App\Enums\MaintenanceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Maintenance extends Model
{
    use LogsActivity;
    protected $fillable = [
        'asset_id',
        'type',
        'description',
        'technician_id',
        'started_at',
        'finished_at',
        'duration_minutes',
        'final_status',
        'next_maintenance_date',
        'observations',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'type' => MaintenanceType::class,
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
            'next_maintenance_date' => 'date',
            'duration_minutes' => 'integer',
        ];
    }

    // --- Relaciones ---

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['type', 'status', 'technician_id', 'asset_id', 'description'])
            ->logOnlyDirty();
    }
}
