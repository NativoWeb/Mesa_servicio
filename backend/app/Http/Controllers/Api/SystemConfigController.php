<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemConfigController extends Controller
{
    public function index(): JsonResponse
    {
        $configs = DB::table('system_configs')->pluck('value', 'key');
        return response()->json(['data' => $configs]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'configs' => 'required|array',
            'configs.*' => 'nullable|string|max:1000',
        ]);

        foreach ($validated['configs'] as $key => $value) {
            DB::table('system_configs')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        return response()->json(['message' => 'Configuración actualizada correctamente.']);
    }
}
