<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'campus',
        'department',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- Relaciones ---

    /** Tickets creados por el usuario */
    public function requestedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'requester_id');
    }

    /** Tickets asignados al usuario */
    public function assignedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assigned_to');
    }

    /** Activos bajo custodia del usuario (cuentadante) */
    public function heldAssets(): HasMany
    {
        return $this->hasMany(Asset::class, 'holder_id');
    }

    /** Mantenimientos realizados como técnico */
    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'technician_id');
    }

    /** Turnos asignados */
    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class, 'technician_id');
    }

    /** Mensajes masivos enviados */
    public function massMessages(): HasMany
    {
        return $this->hasMany(MassMessage::class, 'sender_id');
    }
}
