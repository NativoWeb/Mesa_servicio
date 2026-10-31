<?php

namespace App\Http\Controllers\Api;

use App\Exports\ReportExport;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

        $filename = "reporte_{$type}_".now()->format('Y-m-d').'.xlsx';

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
            'title' => 'Reporte de '.($typeLabels[$type] ?? $type),
            'summary' => $summary,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ]);

        $filename = "reporte_{$type}_".now()->format('Y-m-d').'.pdf';

        return $pdf->download($filename);
    }

    /**
     * Exportar datos row-level en CSV, PDF o Excel.
     *
     * GET /api/reports/export?type=tickets|assets|maintenances&format=csv|pdf|excel&filters...
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:tickets,assets,maintenances',
            'format' => 'required|in:csv,pdf,excel',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'campus' => 'nullable|string',
        ]);

        $type = $request->query('type');
        $format = $request->query('format');
        $filters = $request->only(['from', 'to', 'status', 'priority', 'campus']);
        $data = $this->getExportData($type, $filters);
        $filename = "reporte_{$type}_".now()->format('Y-m-d');

        return match ($format) {
            'csv' => $this->exportCsv($data, $filename),
            'pdf' => $this->exportRowsPdf($data, $type, $filename),
            'excel' => $this->exportRowsExcel($data, $filename),
        };
    }

    private function getExportData(string $type, array $filters): array
    {
        return match ($type) {
            'assets' => $this->reportService->assetsForExport($filters),
            'maintenances' => $this->reportService->maintenancesForExport($filters),
            default => $this->reportService->ticketsForExport($filters),
        };
    }

    private function exportCsv(array $data, string $filename): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        return response()->stream(function () use ($data) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel compatibility
            fputcsv($handle, $data['headings']);
            foreach ($data['rows'] as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, 200, $headers);
    }

    private function exportRowsPdf(array $data, string $type, string $filename)
    {
        $typeLabels = [
            'tickets' => 'Tickets',
            'assets' => 'Activos',
            'maintenances' => 'Mantenimientos',
        ];

        $pdf = Pdf::loadView('reports.export', [
            'title' => 'Reporte de '.($typeLabels[$type] ?? $type),
            'headings' => $data['headings'],
            'rows' => $data['rows'],
            'generatedAt' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'landscape');

        return $pdf->download("{$filename}.pdf");
    }

    private function exportRowsExcel(array $data, string $filename)
    {
        return Excel::download(
            new ReportExport($data['rows'], $data['headings']),
            "{$filename}.xlsx"
        );
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
