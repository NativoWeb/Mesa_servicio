<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMaintenanceRequest;
use App\Http\Requests\UpdateMaintenanceRequest;
use App\Models\Maintenance;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $maintenances = Maintenance::with(['asset', 'technician'])
            ->when($request->asset_id, fn ($q, $id) => $q->where('asset_id', $id))
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->when($request->technician_id, fn ($q, $id) => $q->where('technician_id', $id))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($maintenances);
    }

    public function store(StoreMaintenanceRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $maintenance = Maintenance::create($validated);

        // Actualizar próximo mantenimiento del activo
        if (!empty($validated['next_maintenance_date'])) {
            $maintenance->asset->update(['next_maintenance' => $validated['next_maintenance_date']]);
        }

        // Si el mantenimiento se completó, actualizar estado del activo a operativo
        if (($validated['status'] ?? null) === 'completed') {
            $maintenance->asset->update(['status' => 'operational']);
        }

        return response()->json($maintenance->load(['asset', 'technician']), 201);
    }

    public function show(Maintenance $maintenance): JsonResponse
    {
        return response()->json(
            $maintenance->load(['asset', 'technician', 'comments.user', 'attachments'])
        );
    }

    public function update(UpdateMaintenanceRequest $request, Maintenance $maintenance): JsonResponse
    {
        $validated = $request->validated();

        $maintenance->update($validated);

        // Actualizar próximo mantenimiento del activo si cambió
        if (!empty($validated['next_maintenance_date'])) {
            $maintenance->asset->update(['next_maintenance' => $validated['next_maintenance_date']]);
        }

        // Si se completó el mantenimiento, restaurar activo a operativo
        if (($validated['status'] ?? null) === 'completed' && $maintenance->asset->status !== 'operational') {
            $maintenance->asset->update(['status' => 'operational']);
        }

        return response()->json($maintenance->fresh(['asset', 'technician']));
    }

    public function destroy(Maintenance $maintenance): JsonResponse
    {
        $maintenance->delete();

        return response()->json(['message' => 'Mantenimiento eliminado correctamente.']);
    }
}
