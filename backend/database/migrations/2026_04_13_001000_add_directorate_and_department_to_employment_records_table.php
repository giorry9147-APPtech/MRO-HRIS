<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('employment_records', function (Blueprint $table) {
			$table->foreignId('directorate_id')->nullable()->after('employee_id')->constrained('directorates')->nullOnDelete();
			$table->foreignId('department_id')->nullable()->after('directorate_id')->constrained('departments')->nullOnDelete();
			$table->index(['directorate_id', 'department_id']);
		});
	}

	public function down(): void
	{
		Schema::table('employment_records', function (Blueprint $table) {
			$table->dropIndex(['directorate_id', 'department_id']);
			$table->dropConstrainedForeignId('department_id');
			$table->dropConstrainedForeignId('directorate_id');
		});
	}
};
