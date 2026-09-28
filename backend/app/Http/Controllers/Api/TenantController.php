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

    public function update(Request $request, string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'short_name' => 'sometimes|string|max:10',
            'logo_url' => 'nullable|string|max:500',
            'favicon_url' => 'nullable|string|max:500',
            'branding' => 'sometimes|array',
            'branding.primary' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.primary_light' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.primary_dark' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.accent' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.sidebar_from' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.sidebar_to' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.background' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.card' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.text_primary' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'branding.text_secondary' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'features' => 'sometimes|array',
            'features.*' => 'boolean',
            'campuses' => 'sometimes|array',
            'campuses.*' => 'string|max:100',
            'ticket_categories' => 'sometimes|array',
            'ticket_categories.*' => 'string|max:100',
            'timezone' => 'sometimes|string|max:50',
        ]);

        // stancl/tenancy guarda automaticamente en la columna `data`
        foreach ($validated as $key => $value) {
            $tenant->$key = $value;
        }
        $tenant->save();

        return response()->json(['data' => $tenant->load('domains')]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();
        return response()->json(['message' => 'Tenant eliminado correctamente.']);
    }
}
