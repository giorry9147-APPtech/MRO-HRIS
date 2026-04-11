<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryAssignment extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_id',
		'pay_scale_id',
		'amount',
		'currency',
		'start_date',
		'end_date',
		'status',
		'notes',
	];

	protected $casts = [
		'start_date' => 'date',
		'end_date' => 'date',
		'amount' => 'decimal:2',
	];

	public function employee(): BelongsTo
	{
		return $this->belongsTo(Employee::class);
	}

	public function payScale(): BelongsTo
	{
		return $this->belongsTo(PayScale::class);
	}
}
