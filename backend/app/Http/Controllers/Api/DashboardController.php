<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /** Estadísticas generales para el dashboard */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'tickets' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'in_progress' => Ticket::where('status', 'in_progress')->count(),
                'pending' => Ticket::where('status', 'pending')->count(),
                'escalated' => Ticket::where('status', 'escalated')->count(),
                'closed' => Ticket::where('status', 'closed')->count(),
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
        ]);
    }
}
