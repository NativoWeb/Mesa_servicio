<?php

namespace App\Http\Controllers\Api;

use App\Exports\ReportExport;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    /** Resumen de tickets por estado y prioridad */
    public function ticketsSummary(Request $request): JsonResponse
    {
        return response()->json(
            $this->reportService->ticketsSummary($request->all())
        );
    }

    /** Resumen de activos por categoría y estado */
    public function assetsSummary(Request $request): JsonResponse
    {
        return response()->json(
            $this->reportService->assetsSummary($request->all())
        );
    }

    /** Resumen de mantenimientos */
    public function maintenancesSummary(Request $request): JsonResponse
    {
        return response()->json(
            $this->reportService->maintenancesSummary($request->all())
        );
    }

    /** Exportar reporte en Excel */
    public function exportExcel(Request $request)
    {
        $type = $request->query('type', 'tickets');
        $summary = $this->getSummaryByType($type, $request->all());

        $rows = [];
        $headings = ['Categoria', 'Valor', 'Total'];

        // Convertir el resumen en filas planas para la hoja de calculo
        foreach ($summary as $section => $items) {
            if ($section === 'total') {
                $rows[] = ['Total General', '', (string) $items];
                continue;
            }
            foreach ($items as $key => $value) {
                $rows[] = [ucfirst(str_replace('by_', '', $section)), $key, (string) $value];
            }
        }

        $filename = "reporte_{$type}_" . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new ReportExport($rows, $headings), $filename);
    }

    /** Exportar reporte en PDF */
    public function exportPdf(Request $request)
    {
        $type = $request->query('type', 'tickets');
        $summary = $this->getSummaryByType($type, $request->all());

        $typeLabels = [
            'tickets' => 'Tickets',
            'assets' => 'Activos',
            'maintenances' => 'Mantenimientos',
        ];

        $pdf = Pdf::loadView('reports.summary', [
            'title' => 'Reporte de ' . ($typeLabels[$type] ?? $type),
            'summary' => $summary,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ]);

        $filename = "reporte_{$type}_" . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    /** Obtener resumen segun el tipo de reporte */
    private function getSummaryByType(string $type, array $filters): array
    {
        return match ($type) {
            'assets' => $this->reportService->assetsSummary($filters),
            'maintenances' => $this->reportService->maintenancesSummary($filters),
            default => $this->reportService->ticketsSummary($filters),
        };
    }
}
