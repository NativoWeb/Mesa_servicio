<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SlaConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlaConfigController extends Controller
{
    /** Listar todas las configuraciones SLA ordenadas por prioridad */
    public function index(): JsonResponse
    {
        $configs = SlaConfig::orderByRaw("
            CASE priority
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
                ELSE 5
            END
        ")->get();

        return response()->json(['data' => $configs]);
    }

    /** Crear una nueva configuracion SLA */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'priority' => 'required|string|in:low,medium,high,critical',
            'response_time_hours' => 'required|integer|min:1',
            'resolution_time_hours' => 'required|integer|min:1',
        ]);

        $config = SlaConfig::updateOrCreate(
            ['priority' => $validated['priority']],
            $validated,
        );

        return response()->json($config, 201);
    }

    /** Actualizar una configuracion SLA existente */
    public function update(Request $request, SlaConfig $slaConfig): JsonResponse
    {
        $validated = $request->validate([
            'response_time_hours' => 'sometimes|integer|min:1',
            'resolution_time_hours' => 'sometimes|integer|min:1',
        ]);

        $slaConfig->update($validated);

        return response()->json($slaConfig);
    }
}
