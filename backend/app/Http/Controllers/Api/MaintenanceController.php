<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'type' => 'required|string|in:preventive,corrective,update,cleaning',
            'description' => 'nullable|string',
            'technician_id' => 'required|exists:users,id',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date|after_or_equal:started_at',
            'duration_minutes' => 'nullable|integer|min:0',
            'final_status' => 'nullable|string|max:100',
            'next_maintenance_date' => 'nullable|date',
            'observations' => 'nullable|string',
            'status' => 'nullable|string|in:completed,partial,escalated',
        ]);

        $maintenance = Maintenance::create($validated);

        return response()->json($maintenance->load(['asset', 'technician']), 201);
    }

    public function show(Maintenance $maintenance): JsonResponse
    {
        return response()->json(
            $maintenance->load(['asset', 'technician', 'comments.user', 'attachments'])
        );
    }

    public function update(Request $request, Maintenance $maintenance): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|in:preventive,corrective,update,cleaning',
            'description' => 'nullable|string',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:0',
            'final_status' => 'nullable|string|max:100',
            'next_maintenance_date' => 'nullable|date',
            'observations' => 'nullable|string',
            'status' => 'nullable|string|in:completed,partial,escalated',
        ]);

        $maintenance->update($validated);

        return response()->json($maintenance->fresh(['asset', 'technician']));
    }

    public function destroy(Maintenance $maintenance): JsonResponse
    {
        $maintenance->delete();

        return response()->json(['message' => 'Mantenimiento eliminado correctamente.']);
    }
}
