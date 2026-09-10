<?php

namespace App\Console\Commands;

use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SendScheduledReports extends Command
{
    protected $signature = 'reports:send-scheduled';
    protected $description = 'Send scheduled reports via email';

    public function handle(ReportService $reportService): int
    {
        $this->info('Checking for scheduled reports...');

        // Get system config for scheduled reports (if configured)
        $configs = DB::table('system_configs')
            ->where('key', 'like', 'scheduled_report_%')
            ->pluck('value', 'key');

        if ($configs->isEmpty()) {
            $this->info('No scheduled reports configured.');
            return 0;
        }

        foreach ($configs as $key => $config) {
            $settings = json_decode($config, true);
            if (!$settings || empty($settings['enabled']) || empty($settings['email'])) {
                continue;
            }

            $type = str_replace('scheduled_report_', '', $key);
            $summary = match ($type) {
                'tickets' => $reportService->ticketsSummary([]),
                'assets' => $reportService->assetsSummary([]),
                'maintenances' => $reportService->maintenancesSummary([]),
                default => null,
            };

            if (!$summary) {
                continue;
            }

            try {
                $pdf = Pdf::loadView('reports.summary', [
                    'title' => 'Reporte Programado: ' . ucfirst($type),
                    'summary' => $summary,
                    'generatedAt' => now()->format('d/m/Y H:i'),
                ]);

                Mail::raw(
                    "Adjunto encontrará el reporte programado de {$type}.",
                    function ($message) use ($settings, $type, $pdf) {
                        $message->to($settings['email'])
                            ->subject('Reporte Programado: ' . ucfirst($type))
                            ->attachData($pdf->output(), "reporte_{$type}.pdf", ['mime' => 'application/pdf']);
                    }
                );

                $this->info("Report '{$type}' sent to {$settings['email']}");
            } catch (\Exception $e) {
                $this->error("Failed to send '{$type}': " . $e->getMessage());
            }
        }

        return 0;
    }
}
