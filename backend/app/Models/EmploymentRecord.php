<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class EmploymentRecord extends Model
{
	use HasFactory, LogsActivity;

	public function getActivitylogOptions(): LogOptions
	{
		return LogOptions::defaults()->logFillable()->logOnlyDirty()->dontSubmitEmptyLogs();
	}

	protected $fillable = [
		'employee_id',
		'directorate_id',
		'department_id',
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

	public function directorate(): BelongsTo
	{
		return $this->belongsTo(Directorate::class);
	}

	public function department(): BelongsTo
	{
		return $this->belongsTo(Department::class);
	}

	public function jobFunction(): BelongsTo
	{
		return $this->belongsTo(JobFunction::class);
	}
}
