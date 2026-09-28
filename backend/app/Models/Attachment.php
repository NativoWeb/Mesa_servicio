<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'user_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
    ];

    protected $appends = ['download_url'];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    // --- Accessors ---

    /** URL de descarga del archivo adjunto */
    protected function downloadUrl(): Attribute
    {
        return Attribute::get(fn () => $this->id
            ? route('attachments.download', $this->id)
            : null
        );
    }

    // --- Relaciones ---

    /** Relación polimórfica (Ticket, Asset, Maintenance, etc.) */
    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
