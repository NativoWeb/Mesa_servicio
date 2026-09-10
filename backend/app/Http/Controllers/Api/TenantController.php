<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index(): JsonResponse
    {
        $tenants = Tenant::with('domains')->get();
        return response()->json(['data' => $tenants]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:tenants,id',
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:domains,domain',
            'plan' => 'nullable|string|max:50',
        ]);

        $tenant = Tenant::create([
            'id' => $validated['id'],
            'data' => [
                'name' => $validated['name'],
                'plan' => $validated['plan'] ?? 'basic',
            ],
        ]);

        $tenant->domains()->create(['domain' => $validated['domain']]);

        return response()->json(['data' => $tenant->load('domains')], 201);
    }

    public function show(string $id): JsonResponse
    {
        $tenant = Tenant::with('domains')->findOrFail($id);
        return response()->json(['data' => $tenant]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();
        return response()->json(['message' => 'Tenant eliminado correctamente.']);
    }
}
