<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        // Se implementará con maatwebsite/excel
        return response()->json(['message' => 'Exportación Excel pendiente de implementación.'], 501);
    }

    /** Exportar reporte en PDF */
    public function exportPdf(Request $request)
    {
        // Se implementará con barryvdh/laravel-dompdf
        return response()->json(['message' => 'Exportación PDF pendiente de implementación.'], 501);
    }
}
