<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('work_experiences', function (Blueprint $table) {
			$table->id();
			$table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
			$table->string('company_name');
			$table->string('job_title');
			$table->date('start_date');
			$table->date('end_date')->nullable();
			$table->text('description')->nullable();
			$table->timestamps();

			$table->index(['employee_id', 'start_date']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('work_experiences');
	}
};