<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    private const SYSTEM_ROLES = [
        'admin', 'it_leader', 'technician',
        'inventory_manager', 'end_user', 'asset_holder',
    ];

    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => $this->formatRole($role));

        return response()->json(['success' => true, 'data' => $roles]);
    }

    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->withCount('users')->findOrFail($id);

        return response()->json(['success' => true, 'data' => $this->formatRole($role)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:125|unique:roles,name',
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
            'description' => $validated['description'] ?? null,
            'is_system' => false,
        ]);

        if (! empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatRole($role->load('permissions')->loadCount('users')),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $isSystem = in_array($role->name, self::SYSTEM_ROLES, true);

        $nameRules = ['sometimes', 'string', 'max:125', Rule::unique('roles', 'name')->ignore($role->id)];
        if ($isSystem) {
            $nameRules[] = Rule::in([$role->name]);
        }

        $validated = $request->validate([
            'name' => $nameRules,
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update([
            'name' => $validated['name'] ?? $role->name,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $role->description,
        ]);

        if (array_key_exists('permissions', $validated)) {
            $role->syncPermissions($validated['permissions'] ?? []);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatRole($role->load('permissions')->loadCount('users')),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        if (in_array($role->name, self::SYSTEM_ROLES, true)) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar un rol del sistema.',
            ], 403);
        }

        $userCount = User::role($role->name)->count();
        if ($userCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "No se puede eliminar: el rol tiene {$userCount} usuario(s) asignado(s).",
            ], 409);
        }

        $role->delete();

        return response()->json(['success' => true, 'message' => 'Rol eliminado correctamente.']);
    }

    public function permissions(): JsonResponse
    {
        $permissions = Permission::orderBy('name')->get();

        $grouped = $permissions->groupBy(fn (Permission $p) => explode('.', $p->name)[0])
            ->map(fn ($group) => $group->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
            ])->values());

        return response()->json(['success' => true, 'data' => $grouped]);
    }

    private function formatRole(Role $role): array
    {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'is_system' => (bool) $role->is_system,
            'guard_name' => $role->guard_name,
            'users_count' => $role->users_count ?? 0,
            'permissions' => $role->permissions->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
            ])->values(),
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ];
    }
}
