<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantBrandingController extends Controller
{
    /**
     * Endpoint publico — el frontend lo llama al cargar para obtener branding del tenant.
     * GET /api/tenant/branding?domain=localhost
     */
    public function show(Request $request): JsonResponse
    {
        $domain = $request->query('domain', $request->getHost());

        // Buscar tenant por dominio
        $tenant = Tenant::whereHas('domains', fn ($q) => $q->where('domain', $domain))->first();

        // Si no hay tenant (contexto central), retornar defaults
        if (! $tenant) {
            return response()->json($this->getDefaults());
        }

        return response()->json([
            'id' => $tenant->id,
            'name' => $tenant->name ?? 'Mesa de Servicio TI',
            'short_name' => $tenant->short_name ?? 'SD',
            'logo_url' => $tenant->logo_url ?? null,
            'favicon_url' => $tenant->favicon_url ?? null,
            'branding' => $tenant->branding ?? $this->getDefaultBranding(),
            'features' => $tenant->features ?? $this->getDefaultFeatures(),
            'campuses' => $tenant->campuses ?? [],
            'ticket_categories' => $tenant->ticket_categories ?? $this->getDefaultCategories(),
            'timezone' => $tenant->timezone ?? 'America/Bogota',
        ]);
    }

    private function getDefaults(): array
    {
        return [
            'id' => null,
            'name' => 'Mesa de Servicio TI',
            'short_name' => 'SD',
            'logo_url' => null,
            'favicon_url' => null,
            'branding' => $this->getDefaultBranding(),
            'features' => $this->getDefaultFeatures(),
            'campuses' => [],
            'ticket_categories' => $this->getDefaultCategories(),
            'timezone' => 'America/Bogota',
        ];
    }

    private function getDefaultBranding(): array
    {
        return [
            'primary' => '#1B5E20',
            'primary_light' => '#4CAF50',
            'primary_dark' => '#0D3B0D',
            'accent' => '#F9A825',
            'sidebar_from' => '#1B3A1B',
            'sidebar_to' => '#2E5A2E',
            'background' => '#FAFAFA',
            'card' => '#FFFFFF',
            'text_primary' => '#1A1A1A',
            'text_secondary' => '#6B7280',
        ];
    }

    private function getDefaultFeatures(): array
    {
        return [
            'tickets' => true,
            'inventory' => true,
            'maintenance' => true,
            'mass_messaging' => true,
            'shifts' => true,
            'reports' => true,
            'sla' => true,
            'audit_logs' => true,
        ];
    }

    private function getDefaultCategories(): array
    {
        return [
            'Hardware',
            'Software',
            'Redes e Infraestructura',
            'Correo Electrónico',
            'Soporte Web',
            'Accesos y Permisos',
            'Impresoras',
            'Telefonía',
            'Otro',
        ];
    }
}
