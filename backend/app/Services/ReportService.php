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

    /**
     * Filas de tickets para exportacion (row-level).
     *
     * @return array{headings: string[], rows: list<array>}
     */
    public function ticketsForExport(array $filters = []): array
    {
        $query = Ticket::with(['assignedUser', 'requester']);

        $this->applyCommonFilters($query, $filters, 'tickets');

        $rows = $query->orderByDesc('created_at')->get()->map(fn (Ticket $t) => [
            $t->ticket_number,
            $t->title,
            $t->status?->value ?? '',
            $t->priority?->value ?? '',
            $t->category ?? '',
            $t->campus ?? '',
            $t->assignedUser?->name ?? 'Sin asignar',
            $t->created_at?->format('Y-m-d H:i'),
            $t->updated_at?->format('Y-m-d H:i'),
        ])->toArray();

        return [
            'headings' => ['Numero', 'Titulo', 'Estado', 'Prioridad', 'Categoria', 'Campus', 'Asignado', 'Creado', 'Actualizado'],
            'rows' => $rows,
        ];
    }

    /**
     * Filas de activos para exportacion (row-level).
     *
     * @return array{headings: string[], rows: list<array>}
     */
    public function assetsForExport(array $filters = []): array
    {
        $query = Asset::with('holder');

        $this->applyCommonFilters($query, $filters, 'assets');

        $rows = $query->orderByDesc('created_at')->get()->map(fn (Asset $a) => [
            $a->asset_code,
            $a->name,
            $a->category?->value ?? '',
            $a->status?->value ?? '',
            $a->campus ?? '',
            $a->location ?? '',
            $a->serial ?? '',
            $a->holder?->name ?? 'Sin asignar',
        ])->toArray();

        return [
            'headings' => ['Codigo', 'Nombre', 'Categoria', 'Estado', 'Campus', 'Ubicacion', 'Serial', 'Cuentadante'],
            'rows' => $rows,
        ];
    }

    /**
     * Filas de mantenimientos para exportacion (row-level).
     *
     * @return array{headings: string[], rows: list<array>}
     */
    public function maintenancesForExport(array $filters = []): array
    {
        $query = Maintenance::with(['asset', 'technician']);

        $this->applyCommonFilters($query, $filters, 'maintenances');

        $rows = $query->orderByDesc('created_at')->get()->map(fn (Maintenance $m) => [
            $m->id,
            $m->asset?->name ?? '',
            $m->type?->value ?? '',
            $m->status ?? '',
            $m->started_at?->format('Y-m-d') ?? '',
            $m->technician?->name ?? 'Sin asignar',
            $m->final_status ?? '',
        ])->toArray();

        return [
            'headings' => ['ID', 'Activo', 'Tipo', 'Estado', 'Fecha programada', 'Tecnico', 'Resultado'],
            'rows' => $rows,
        ];
    }

    /**
     * Aplicar filtros comunes de fecha, estado, prioridad y campus.
     */
    private function applyCommonFilters($query, array $filters, string $type): void
    {
        if (! empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (! empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (! empty($filters['campus']) && in_array($type, ['tickets', 'assets'])) {
            $query->where('campus', $filters['campus']);
        }
        if (! empty($filters['priority']) && $type === 'tickets') {
            $query->where('priority', $filters['priority']);
        }
    }
}
