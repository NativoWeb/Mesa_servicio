<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
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
            ->when($request->holder_id, fn ($q, $id) => $q->where('holder_id', $id))
            ->when($request->search, fn ($q, $s) => $q->where('name', 'ilike', "%{$s}%")
                ->orWhere('asset_code', 'ilike', "%{$s}%")
                ->orWhere('serial', 'ilike', "%{$s}%"))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($assets);
    }

    public function store(StoreAssetRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $asset = Asset::create($validated);

        return response()->json($asset->load('holder'), 201);
    }

    public function show(Asset $asset): JsonResponse
    {
        return response()->json(
            $asset->load(['holder', 'maintenances.technician', 'comments.user', 'attachments'])
        );
    }

    public function update(UpdateAssetRequest $request, Asset $asset): JsonResponse
    {
        $validated = $request->validated();

        $asset->update($validated);

        return response()->json($asset->fresh('holder'));
    }

    public function destroy(Asset $asset): JsonResponse
    {
        $asset->delete();

        return response()->json(['message' => 'Activo eliminado correctamente.']);
    }
}
