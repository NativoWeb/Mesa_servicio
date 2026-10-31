<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemConfigController extends Controller
{
    private const SENSITIVE_PATTERNS = ['password', 'secret'];

    private const ALLOWED_KEYS = [
        'app_name',
        'app_logo',
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password',
        'smtp_encryption',
        'smtp_from_address',
        'smtp_from_name',
        'maintenance_mode',
        'max_file_size',
        'allowed_extensions',
        'default_ticket_priority',
        'auto_assign_tickets',
        'sla_enabled',
    ];

    public function index(): JsonResponse
    {
        $configs = DB::table('system_configs')->pluck('value', 'key');

        $masked = $configs->map(function ($value, $key) {
            foreach (self::SENSITIVE_PATTERNS as $pattern) {
                if (str_contains(strtolower($key), $pattern)) {
                    return '********';
                }
            }

            return $value;
        });

        return response()->json(['data' => $masked]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'configs' => 'required|array',
            'configs.*' => 'nullable|string|max:1000',
        ]);

        $invalidKeys = array_diff(
            array_keys($validated['configs']),
            self::ALLOWED_KEYS
        );

        if (! empty($invalidKeys)) {
            return response()->json([
                'success' => false,
                'message' => 'Keys no permitidas.',
                'invalid_keys' => array_values($invalidKeys),
            ], 422);
        }

        foreach ($validated['configs'] as $key => $value) {
            DB::table('system_configs')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        return response()->json(['message' => 'Configuración actualizada correctamente.']);
    }
}
