<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('pay_scales', function (Blueprint $table) {
			$table->id();
			$table->string('scale_code', 50);
			$table->unsignedInteger('step_number')->default(1);
			$table->decimal('amount', 12, 2);
			$table->string('currency', 3)->default('USD');
			$table->text('allowance_notes')->nullable();
			$table->boolean('is_active')->default(true);
			$table->timestamps();

			$table->unique(['scale_code', 'step_number']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('pay_scales');
	}
};