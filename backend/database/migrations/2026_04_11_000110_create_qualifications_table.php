<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('qualifications', function (Blueprint $table) {
			$table->id();
			$table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
			$table->string('name');
			$table->string('institution')->nullable();
			$table->date('obtained_date')->nullable();
			$table->date('expiry_date')->nullable();
			$table->string('credential_id', 120)->nullable();
			$table->enum('status', ['valid', 'expired', 'revoked', 'pending'])->default('valid');
			$table->text('notes')->nullable();
			$table->timestamps();

			$table->index(['employee_id', 'status']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('qualifications');
	}
};