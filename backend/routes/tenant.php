<?php

declare(strict_types=1);

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
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\SlaConfigController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\EnsureTenantAccess;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the TenantRouteServiceProvider and are
| scoped to the tenant identified by the request domain.
| All operational endpoints (tickets, assets, maintenances, etc.) are
| mirrored here so each tenant operates on its own database.
|
*/

Route::middleware([
    'api',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->prefix('api')->group(function () {

    // --- Auth (public within tenant context) ---
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    // --- Protected tenant routes ---
    Route::middleware(['auth:sanctum', EnsureTenantAccess::class])->group(function () {

        // Auth (requires token)
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

        // Assets
        Route::apiResource('assets', AssetController::class);

        // Maintenances
        Route::apiResource('maintenances', MaintenanceController::class);

        // Users
        Route::apiResource('users', UserController::class);

        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('tickets', [ReportController::class, 'ticketsSummary']);
            Route::get('assets', [ReportController::class, 'assetsSummary']);
            Route::get('maintenances', [ReportController::class, 'maintenancesSummary']);
            Route::get('export/excel', [ReportController::class, 'exportExcel']);
            Route::get('export/pdf', [ReportController::class, 'exportPdf']);
        });

        // SLA Config
        Route::apiResource('sla-configs', SlaConfigController::class)->only(['index', 'store', 'update']);

        // Shifts
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

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index']);

        // Audit logs
        Route::get('audit-logs', [AuditLogController::class, 'index']);

        // Mass messages
        Route::prefix('messages')->group(function () {
            Route::get('/', [MessageController::class, 'index']);
            Route::post('/', [MessageController::class, 'store']);
            Route::get('{message}', [MessageController::class, 'show']);
            Route::put('{message}', [MessageController::class, 'update']);
            Route::delete('{message}', [MessageController::class, 'destroy']);
            Route::post('{message}/send', [MessageController::class, 'send']);
        });
    });
});
