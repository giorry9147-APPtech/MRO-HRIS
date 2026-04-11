<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('positions', function (Blueprint $table) {
			$table->foreignId('job_function_id')->nullable()->after('department_id')->constrained('job_functions')->nullOnDelete();
		});
	}

	public function down(): void
	{
		Schema::table('positions', function (Blueprint $table) {
			$table->dropConstrainedForeignId('job_function_id');
		});
	}
};