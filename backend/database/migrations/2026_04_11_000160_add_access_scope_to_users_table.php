<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('users', function (Blueprint $table) {
			$table->string('scope_type', 20)->default('all')->after('password');
			$table->json('allowed_directorate_ids')->nullable()->after('scope_type');
			$table->json('allowed_department_ids')->nullable()->after('allowed_directorate_ids');
		});
	}

	public function down(): void
	{
		Schema::table('users', function (Blueprint $table) {
			$table->dropColumn(['scope_type', 'allowed_directorate_ids', 'allowed_department_ids']);
		});
	}
};
