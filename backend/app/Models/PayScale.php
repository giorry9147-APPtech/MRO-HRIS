<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayScale extends Model
{
	use HasFactory;

	protected $fillable = [
		'scale_code',
		'step_number',
		'amount',
		'currency',
		'allowance_notes',
		'is_active',
	];

	protected $casts = [
		'amount' => 'decimal:2',
		'is_active' => 'boolean',
	];

	public function salaryAssignments(): HasMany
	{
		return $this->hasMany(SalaryAssignment::class);
	}
}