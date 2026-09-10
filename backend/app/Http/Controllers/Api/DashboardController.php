<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /** Estadísticas generales para el dashboard */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->roles->first()?->name;

        $base = [
            'tickets' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'in_progress' => Ticket::where('status', 'in_progress')->count(),
                'pending' => Ticket::where('status', 'pending')->count(),
                'escalated' => Ticket::where('status', 'escalated')->count(),
                'closed' => Ticket::where('status', 'closed')->count(),
                'closed_today' => Ticket::where('status', 'closed')
                    ->whereDate('closed_at', today())
                    ->count(),
            ],
            'assets' => [
                'total' => Asset::count(),
                'operational' => Asset::where('status', 'operational')->count(),
                'damaged' => Asset::where('status', 'damaged')->count(),
                'decommissioned' => Asset::where('status', 'decommissioned')->count(),
            ],
            'maintenances' => [
                'total' => Maintenance::count(),
                'pending_this_month' => Maintenance::where('status', '!=', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ],
            'users' => [
                'total' => User::count(),
            ],
        ];

        // Datos extra según rol
        if (in_array($role, ['admin', 'it_leader'])) {
            $base['tickets_by_priority'] = Ticket::select('priority', DB::raw('count(*) as total'))
                ->groupBy('priority')
                ->pluck('total', 'priority');

            $base['tickets_weekly'] = $this->ticketsWeekly();

            $base['technician_workload'] = $this->technicianWorkload();

            $base['unassigned_tickets'] = Ticket::with('requester')
                ->whereNull('assigned_to')
                ->where('status', '!=', 'closed')
                ->orderBy('created_at')
                ->limit(10)
                ->get();
        }

        if ($role === 'technician') {
            $base['my_tickets'] = [
                'open' => Ticket::where('assigned_to', $user->id)->where('status', 'open')->count(),
                'in_progress' => Ticket::where('assigned_to', $user->id)->where('status', 'in_progress')->count(),
                'pending' => Ticket::where('assigned_to', $user->id)->where('status', 'pending')->count(),
                'closed_today' => Ticket::where('assigned_to', $user->id)
                    ->where('status', 'closed')
                    ->whereDate('closed_at', today())
                    ->count(),
            ];
        }

        if ($role === 'asset_holder') {
            $base['my_assets'] = [
                'total' => Asset::where('holder_id', $user->id)->count(),
                'damaged' => Asset::where('holder_id', $user->id)->where('status', 'damaged')->count(),
                'maintenance_this_month' => Maintenance::whereHas('asset', fn ($q) => $q->where('holder_id', $user->id))
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ];
        }

        return response()->json($base);
    }

    /** Tickets creados vs cerrados últimos 7 días */
    private function ticketsWeekly(): array
    {
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $days[] = [
                'day' => $date->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'creados' => Ticket::whereDate('created_at', $date)->count(),
                'resueltos' => Ticket::where('status', 'closed')->whereDate('closed_at', $date)->count(),
            ];
        }
        return $days;
    }

    /** Carga de tickets por técnico activo */
    private function technicianWorkload(): array
    {
        return User::role('technician')
            ->withCount(['assignedTickets as open_tickets' => function ($q) {
                $q->whereIn('status', ['open', 'in_progress', 'pending']);
            }])
            ->orderByDesc('open_tickets')
            ->limit(10)
            ->get()
            ->map(fn ($tech) => [
                'id' => $tech->id,
                'name' => $tech->name,
                'campus' => $tech->campus,
                'open_tickets' => $tech->open_tickets,
            ])
            ->toArray();
    }
}
