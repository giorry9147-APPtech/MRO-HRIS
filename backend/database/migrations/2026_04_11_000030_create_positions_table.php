<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('title', 120);
            $table->string('code', 50)->nullable()->unique();
            $table->string('grade', 50)->nullable();
            $table->enum('status', ['vacant', 'occupied', 'frozen', 'abolished'])->default('vacant');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
