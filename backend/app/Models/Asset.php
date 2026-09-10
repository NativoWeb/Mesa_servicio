<?php

namespace App\Models;

use App\Enums\AssetCategory;
use App\Enums\AssetStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'brand',
        'model',
        'serial',
        'purchase_date',
        'campus',
        'floor',
        'location',
        'holder_id',
        'status',
        'specs',
        'warranty_expiry',
        'next_maintenance',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'category' => AssetCategory::class,
            'status' => AssetStatus::class,
            'specs' => 'array',
            'purchase_date' => 'date',
            'warranty_expiry' => 'date',
            'next_maintenance' => 'date',
        ];
    }

    /**
     * Auto-generar asset_code al crear (UTS-XXX-XXXX)
     */
    protected static function booted(): void
    {
        static::creating(function (Asset $asset) {
            if (empty($asset->asset_code)) {
                $prefix = strtoupper(substr($asset->category?->value ?? 'OTH', 0, 3));
                $lastNumber = static::withTrashed()->max('id') ?? 0;
                $asset->asset_code = 'UTS-' . $prefix . '-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // --- Relaciones ---

    /** Cuentadante / responsable del activo */
    public function holder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'holder_id');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
