<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploymentRecord extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_id',
		'position_id',
		'job_function_id',
		'start_date',
		'end_date',
		'employment_type',
		'status',
		'notes',
	];

	protected $casts = [
		'start_date' => 'date',
		'end_date' => 'date',
	];

	public function employee(): BelongsTo
	{
		return $this->belongsTo(Employee::class);
	}

	public function position(): BelongsTo
	{
		return $this->belongsTo(Position::class);
	}

	public function jobFunction(): BelongsTo
	{
		return $this->belongsTo(JobFunction::class);
	}
}
