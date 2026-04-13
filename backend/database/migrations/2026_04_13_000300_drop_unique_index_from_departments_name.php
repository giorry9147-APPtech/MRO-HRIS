<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('departments', function (Blueprint $table) {
			$table->dropUnique('departments_name_unique');
			$table->index('name');
		});
	}

	public function down(): void
	{
		Schema::table('departments', function (Blueprint $table) {
			$table->dropIndex('departments_name_index');
			$table->unique('name');
		});
	}
};
