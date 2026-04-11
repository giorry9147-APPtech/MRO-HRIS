<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('salary_assignments', function (Blueprint $table) {
			$table->foreignId('pay_scale_id')->nullable()->after('employee_id')->constrained('pay_scales')->nullOnDelete();
		});
	}

	public function down(): void
	{
		Schema::table('salary_assignments', function (Blueprint $table) {
			$table->dropConstrainedForeignId('pay_scale_id');
		});
	}
};