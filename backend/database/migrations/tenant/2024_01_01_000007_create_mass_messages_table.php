<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mass_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->string('subject');
            $table->text('body');
            $table->string('channel')->default('email'); // email, sms, both
            $table->unsignedBigInteger('template_id')->nullable();
            $table->jsonb('recipients_filter')->nullable(); // Filtros para seleccionar destinatarios
            $table->unsignedInteger('recipients_count')->default(0);
            $table->string('status')->default('draft'); // draft, sending, sent, failed
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('sender_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mass_messages');
    }
};
