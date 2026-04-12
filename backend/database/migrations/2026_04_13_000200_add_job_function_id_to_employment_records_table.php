<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('employment_records', function (Blueprint $table) {
			$table->foreignId('job_function_id')->nullable()->after('position_id')->constrained('job_functions')->nullOnDelete();
		});

		// Backfill function from linked position where available.
		DB::statement('UPDATE employment_records SET job_function_id = (SELECT positions.job_function_id FROM positions WHERE positions.id = employment_records.position_id) WHERE job_function_id IS NULL');
	}

	public function down(): void
	{
		Schema::table('employment_records', function (Blueprint $table) {
			$table->dropConstrainedForeignId('job_function_id');
		});
	}
};
