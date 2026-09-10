<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $assets = Asset::with('holder')
            ->when($request->category, fn ($q, $cat) => $q->where('category', $cat))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->campus, fn ($q, $campus) => $q->where('campus', $campus))
            ->when($request->search, fn ($q, $s) => $q->where('name', 'ilike', "%{$s}%")
                ->orWhere('asset_code', 'ilike', "%{$s}%")
                ->orWhere('serial', 'ilike', "%{$s}%"))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($assets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:pc,laptop,printer,server,router,switch,monitor,projector,other',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'serial' => 'nullable|string|max:100|unique:assets,serial',
            'purchase_date' => 'nullable|date',
            'campus' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'holder_id' => 'nullable|exists:users,id',
            'status' => 'nullable|string|in:new,operational,damaged,decommissioned,retired',
            'specs' => 'nullable|array',
            'warranty_expiry' => 'nullable|date',
            'next_maintenance' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $asset = Asset::create($validated);

        return response()->json($asset->load('holder'), 201);
    }

    public function show(Asset $asset): JsonResponse
    {
        return response()->json(
            $asset->load(['holder', 'maintenances.technician', 'comments.user', 'attachments'])
        );
    }

    public function update(Request $request, Asset $asset): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|in:pc,laptop,printer,server,router,switch,monitor,projector,other',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'serial' => 'nullable|string|max:100|unique:assets,serial,' . $asset->id,
            'purchase_date' => 'nullable|date',
            'campus' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'holder_id' => 'nullable|exists:users,id',
            'status' => 'nullable|string|in:new,operational,damaged,decommissioned,retired',
            'specs' => 'nullable|array',
            'warranty_expiry' => 'nullable|date',
            'next_maintenance' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $asset->update($validated);

        return response()->json($asset->fresh('holder'));
    }

    public function destroy(Asset $asset): JsonResponse
    {
        $asset->delete();

        return response()->json(['message' => 'Activo eliminado correctamente.']);
    }
}
