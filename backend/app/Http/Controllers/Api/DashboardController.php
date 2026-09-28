<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use App\Models\User;
use App\Services\ReportService;
use App\Services\SlaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
        private readonly SlaService $slaService,
    ) {}

    /** Estadísticas generales para el dashboard */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->roles->first()?->name;

        $ticketsSummary = $this->reportService->ticketsSummary();
        $assetsSummary = $this->reportService->assetsSummary();
        $maintenancesSummary = $this->reportService->maintenancesSummary();

        $base = [
            'tickets' => [
                'total' => $ticketsSummary['total'],
                'open' => $ticketsSummary['by_status']['open'] ?? 0,
                'in_progress' => $ticketsSummary['by_status']['in_progress'] ?? 0,
                'pending' => $ticketsSummary['by_status']['pending'] ?? 0,
                'escalated' => $ticketsSummary['by_status']['escalated'] ?? 0,
                'closed' => $ticketsSummary['by_status']['closed'] ?? 0,
                'closed_today' => Ticket::where('status', 'closed')
                    ->whereDate('closed_at', today())->count(),
                'by_status' => $ticketsSummary['by_status'],
                'by_priority' => $ticketsSummary['by_priority'],
            ],
            'assets' => [
                'total' => $assetsSummary['total'],
                'operational' => $assetsSummary['by_status']['operational'] ?? 0,
                'damaged' => $assetsSummary['by_status']['damaged'] ?? 0,
                'decommissioned' => $assetsSummary['by_status']['decommissioned'] ?? 0,
                'by_category' => $assetsSummary['by_category'],
                'by_status' => $assetsSummary['by_status'],
            ],
            'maintenances' => [
                'total' => $maintenancesSummary['total'],
                'pending_this_month' => Maintenance::where('status', '!=', 'completed')
                    ->whereMonth('created_at', now()->month)->count(),
                'by_type' => $maintenancesSummary['by_type'],
                'by_status' => $maintenancesSummary['by_status'],
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

            $base['sla_compliance'] = $this->slaCompliance();

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

            $base['my_sla_at_risk'] = Ticket::where('assigned_to', $user->id)
                ->whereNotIn('status', ['closed'])
                ->whereNotNull('sla_deadline')
                ->get()
                ->filter(function ($t) {
                    $remaining = $this->slaService->remainingMinutes($t);
                    return $remaining !== null && $remaining <= 60 && $remaining > 0;
                })
                ->count();
        }

        if ($role === 'end_user') {
            $base['my_tickets'] = [
                'open' => Ticket::where('requester_id', $user->id)->where('status', 'open')->count(),
                'in_progress' => Ticket::where('requester_id', $user->id)->where('status', 'in_progress')->count(),
                'closed' => Ticket::where('requester_id', $user->id)->where('status', 'closed')->count(),
            ];
        }

        if ($role === 'inventory_manager') {
            $base['assets_detail'] = [
                'total' => Asset::count(),
                'operational' => Asset::where('status', 'operational')->count(),
                'damaged' => Asset::where('status', 'damaged')->count(),
                'decommissioned' => Asset::where('status', 'decommissioned')->count(),
                'pending_maintenance' => Asset::whereNotNull('next_maintenance')
                    ->where('next_maintenance', '<=', now()->addDays(7))
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

    /** Tasa de cumplimiento SLA */
    private function slaCompliance(): array
    {
        $total = Ticket::where('status', 'closed')
            ->whereNotNull('sla_deadline')
            ->count();

        if ($total === 0) {
            return ['rate' => 100, 'met' => 0, 'breached' => 0, 'total' => 0];
        }

        $met = Ticket::where('status', 'closed')
            ->whereNotNull('sla_deadline')
            ->whereNotNull('closed_at')
            ->whereColumn('closed_at', '<=', 'sla_deadline')
            ->count();

        $breached = $total - $met;

        return [
            'rate' => round(($met / $total) * 100, 1),
            'met' => $met,
            'breached' => $breached,
            'total' => $total,
        ];
    }
}
