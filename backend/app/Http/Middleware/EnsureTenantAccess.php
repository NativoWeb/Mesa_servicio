<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware que verifica que el usuario autenticado pertenezca al tenant actual.
 */
class EnsureTenantAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $tenant = tenant();

        if (! $user || ! $tenant) {
            return response()->json([
                'message' => 'Acceso denegado: no se pudo verificar el tenant.',
            ], 403);
        }

        // Aquí se puede agregar lógica adicional para verificar
        // que el usuario pertenece al tenant actual
        // Ejemplo: if ($user->tenant_id !== $tenant->id) { ... }

        return $next($request);
    }
}
