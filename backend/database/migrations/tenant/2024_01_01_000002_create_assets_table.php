<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique(); // Auto UTS-XXX-XXXX
            $table->string('name');
            $table->string('category'); // enum AssetCategory
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial')->unique()->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('campus')->nullable(); // Sede
            $table->string('floor')->nullable();
            $table->string('location')->nullable();
            $table->foreignId('holder_id')->nullable()->constrained('users')->nullOnDelete(); // Cuentadante
            $table->string('status')->default('operational'); // enum AssetStatus
            $table->jsonb('specs')->nullable(); // Procesador, RAM, disco, etc.
            $table->date('warranty_expiry')->nullable();
            $table->date('next_maintenance')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'status']);
            $table->index('campus');
            $table->index('holder_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
