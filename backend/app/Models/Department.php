<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
	use HasFactory;

	protected $fillable = [
		'directorate_id',
		'parent_department_id',
		'name',
		'code',
		'status',
	];

	public function directorate(): BelongsTo
	{
		return $this->belongsTo(Directorate::class);
	}

	public function parentDepartment(): BelongsTo
	{
		return $this->belongsTo(Department::class, 'parent_department_id');
	}

	public function subDepartments(): HasMany
	{
		return $this->hasMany(Department::class, 'parent_department_id');
	}
}
