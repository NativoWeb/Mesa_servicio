<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('type'); // enum MaintenanceType
            $table->text('description')->nullable();
            $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->string('final_status')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->text('observations')->nullable();
            $table->string('status')->default('completed'); // completed, partial, escalated
            $table->timestamps();

            $table->index('asset_id');
            $table->index('technician_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
