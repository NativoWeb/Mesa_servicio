<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

/**
 * Servicio para generación de reportes y estadísticas.
 */
class ReportService
{
    /**
     * Resumen de tickets agrupados por estado y prioridad.
     */
    public function ticketsSummary(array $filters = []): array
    {
        $query = Ticket::query();

        if (! empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (! empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }
        if (! empty($filters['campus'])) {
            $query->where('campus', $filters['campus']);
        }

        return [
            'by_status' => (clone $query)->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray(),
            'by_priority' => (clone $query)->select('priority', DB::raw('count(*) as total'))
                ->groupBy('priority')
                ->pluck('total', 'priority')
                ->toArray(),
            'total' => $query->count(),
        ];
    }

    /**
     * Resumen de activos agrupados por categoría y estado.
     */
    public function assetsSummary(array $filters = []): array
    {
        $query = Asset::query();

        if (! empty($filters['campus'])) {
            $query->where('campus', $filters['campus']);
        }

        return [
            'by_category' => (clone $query)->select('category', DB::raw('count(*) as total'))
                ->groupBy('category')
                ->pluck('total', 'category')
                ->toArray(),
            'by_status' => (clone $query)->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray(),
            'total' => $query->count(),
        ];
    }

    /**
     * Resumen de mantenimientos agrupados por tipo y estado.
     */
    public function maintenancesSummary(array $filters = []): array
    {
        $query = Maintenance::query();

        if (! empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (! empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return [
            'by_type' => (clone $query)->select('type', DB::raw('count(*) as total'))
                ->groupBy('type')
                ->pluck('total', 'type')
                ->toArray(),
            'by_status' => (clone $query)->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray(),
            'total' => $query->count(),
        ];
    }
}
