<?php

use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\SlaConfigController;
use App\Http\Controllers\Api\SystemConfigController;
use App\Http\Controllers\Api\TenantBrandingController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas API — Mesa de Ayuda UTS
|--------------------------------------------------------------------------
*/

// --- Branding del tenant (publico, sin auth) ---
Route::get('tenant/branding', [TenantBrandingController::class, 'show']);

// --- Autenticacion (publicas, con rate limit) ---
Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// --- Rutas protegidas con Sanctum ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth (requiere token)
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Dashboard — todos los roles autenticados (scoping por rol en el controller)
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
    });

    // Tickets — todos los roles pueden ver/crear (scoping por rol en el controller)
    Route::apiResource('tickets', TicketController::class);

    // Notificaciones (actividad relevante por rol)
    Route::get('notifications', [NotificationController::class, 'index']);

    // Comments (polymorphic)
    Route::prefix('{type}/{id}/comments')->where(['type' => 'tickets|assets|maintenances'])->group(function () {
        Route::get('/', [CommentController::class, 'index']);
        Route::post('/', [CommentController::class, 'store']);
    });

    // Attachments (polymorphic)
    Route::prefix('{type}/{id}/attachments')->where(['type' => 'tickets|assets|maintenances'])->group(function () {
        Route::get('/', [AttachmentController::class, 'index']);
        Route::post('/', [AttachmentController::class, 'store']);
    });
    Route::get('attachments/{attachment}/download', [AttachmentController::class, 'download'])
        ->name('attachments.download');
    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy']);

    // --- Solo admin ---
    Route::middleware(['role:admin'])->group(function () {
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::apiResource('tenants', TenantController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::get('system-configs', [SystemConfigController::class, 'index']);
        Route::put('system-configs', [SystemConfigController::class, 'update']);
        Route::get('audit-logs', [AuditLogController::class, 'index']);
        Route::apiResource('sla-configs', SlaConfigController::class)->only(['index', 'store', 'update']);
        Route::apiResource('roles', RoleController::class);
        Route::get('permissions', [RoleController::class, 'permissions']);
    });

    // --- Admin + IT Leader + Inventory Manager: lectura de usuarios ---
    Route::middleware(['role:admin|it_leader|inventory_manager'])->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{user}', [UserController::class, 'show']);
    });

    // --- Admin + IT Leader ---
    Route::middleware(['role:admin|it_leader'])->group(function () {
        // Mensajes masivos
        Route::prefix('messages')->group(function () {
            Route::get('/', [MessageController::class, 'index']);
            Route::post('/', [MessageController::class, 'store']);
            Route::get('{message}', [MessageController::class, 'show']);
            Route::put('{message}', [MessageController::class, 'update']);
            Route::delete('{message}', [MessageController::class, 'destroy']);
            Route::post('{message}/send', [MessageController::class, 'send']);
        });

        // Reportes
        Route::prefix('reports')->group(function () {
            Route::get('tickets', [ReportController::class, 'ticketsSummary']);
            Route::get('assets', [ReportController::class, 'assetsSummary']);
            Route::get('maintenances', [ReportController::class, 'maintenancesSummary']);
            Route::get('export/excel', [ReportController::class, 'exportExcel']);
            Route::get('export/pdf', [ReportController::class, 'exportPdf']);
        });

        // Turnos: CRUD para admin y líder
        Route::prefix('shifts')->group(function () {
            Route::post('/', [ShiftController::class, 'store']);
            Route::put('{shift}', [ShiftController::class, 'update']);
            Route::delete('{shift}', [ShiftController::class, 'destroy']);
        });
    });

    // --- Mantenimientos: CRUD para admin/lider/técnico/inventario, lectura para asset_holder ---
    Route::middleware(['role:admin|it_leader|technician|inventory_manager|asset_holder'])->group(function () {
        Route::get('maintenances', [MaintenanceController::class, 'index']);
        Route::get('maintenances/{maintenance}', [MaintenanceController::class, 'show']);
    });
    Route::middleware(['role:admin|it_leader|technician|inventory_manager'])->group(function () {
        Route::post('maintenances', [MaintenanceController::class, 'store']);
        Route::put('maintenances/{maintenance}', [MaintenanceController::class, 'update']);
        Route::delete('maintenances/{maintenance}', [MaintenanceController::class, 'destroy']);
    });

    // Turnos: lectura para admin, líder y técnicos
    Route::middleware(['role:admin|it_leader|technician'])->group(function () {
        Route::get('shifts', [ShiftController::class, 'index']);
        Route::get('shifts/{shift}', [ShiftController::class, 'show']);
    });

    // --- Activos: CRUD para admin/lider/inventario, lectura para asset_holder ---
    Route::middleware(['role:admin|it_leader|inventory_manager|asset_holder'])->group(function () {
        Route::get('assets', [AssetController::class, 'index']);
        Route::get('assets/{asset}', [AssetController::class, 'show']);
    });
    Route::middleware(['role:admin|it_leader|inventory_manager'])->group(function () {
        Route::post('assets', [AssetController::class, 'store']);
        Route::put('assets/{asset}', [AssetController::class, 'update']);
        Route::delete('assets/{asset}', [AssetController::class, 'destroy']);
    });
});
