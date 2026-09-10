<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\SlaConfigController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\SystemConfigController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas API — Mesa de Ayuda UTS
|--------------------------------------------------------------------------
*/

// --- Autenticacion (publicas) ---
Route::prefix('auth')->group(function () {
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

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
    });

    // Tickets
    Route::apiResource('tickets', TicketController::class);

    // Activos
    Route::apiResource('assets', AssetController::class);

    // Mantenimientos
    Route::apiResource('maintenances', MaintenanceController::class);

    // Usuarios
    Route::apiResource('users', UserController::class);

    // Reportes
    Route::prefix('reports')->group(function () {
        Route::get('tickets', [ReportController::class, 'ticketsSummary']);
        Route::get('assets', [ReportController::class, 'assetsSummary']);
        Route::get('maintenances', [ReportController::class, 'maintenancesSummary']);
        Route::get('export/excel', [ReportController::class, 'exportExcel']);
        Route::get('export/pdf', [ReportController::class, 'exportPdf']);
    });

    // Configuracion SLA
    Route::apiResource('sla-configs', SlaConfigController::class)->only(['index', 'store', 'update']);

    // Turnos
    Route::prefix('shifts')->group(function () {
        Route::get('/', [ShiftController::class, 'index']);
        Route::post('/', [ShiftController::class, 'store']);
        Route::get('{shift}', [ShiftController::class, 'show']);
        Route::put('{shift}', [ShiftController::class, 'update']);
        Route::delete('{shift}', [ShiftController::class, 'destroy']);
    });

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
    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy']);

    // Notificaciones (actividad relevante por rol)
    Route::get('notifications', [NotificationController::class, 'index']);

    // Logs de auditoría
    Route::get('audit-logs', [AuditLogController::class, 'index']);

    // Tenants (admin only)
    Route::apiResource('tenants', TenantController::class)->only(['index', 'store', 'show', 'destroy']);

    // Configuracion del sistema
    Route::get('system-configs', [SystemConfigController::class, 'index']);
    Route::put('system-configs', [SystemConfigController::class, 'update']);

    // Mensajes masivos
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::post('/', [MessageController::class, 'store']);
        Route::get('{message}', [MessageController::class, 'show']);
        Route::put('{message}', [MessageController::class, 'update']);
        Route::delete('{message}', [MessageController::class, 'destroy']);
        Route::post('{message}/send', [MessageController::class, 'send']);
    });
});
