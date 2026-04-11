<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Position extends Model
{
	use HasFactory;

	protected $fillable = [
		'department_id',
		'job_function_id',
		'title',
		'code',
		'grade',
		'status',
	];

	public function department(): BelongsTo
	{
		return $this->belongsTo(Department::class);
	}

	public function jobFunction(): BelongsTo
	{
		return $this->belongsTo(JobFunction::class);
	}
}
