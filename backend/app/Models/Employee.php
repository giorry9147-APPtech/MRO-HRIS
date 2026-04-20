<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_number',
		'first_name',
		'last_name',
		'email',
		'phone',
		'address',
		'profile_photo_path',
		'date_joined',
		'status',
	];

	protected $casts = [
		'date_joined' => 'date',
	];

	public function documents(): HasMany
	{
		return $this->hasMany(EmployeeDocument::class);
	}

	public function employmentRecords(): HasMany
	{
		return $this->hasMany(EmploymentRecord::class)->latest('start_date');
	}

	public function currentEmploymentRecord(): HasOne
	{
		return $this->hasOne(EmploymentRecord::class)->ofMany([
			'start_date' => 'max',
			'id' => 'max',
		], function ($query) {
			$query->where('status', 'active');
		});
	}

	public function assetAssignments(): HasMany
	{
		return $this->hasMany(AssetAssignment::class)->latest('assigned_at');
	}

	public function salaryAssignments(): HasMany
	{
		return $this->hasMany(SalaryAssignment::class)->latest('start_date');
	}

	public function qualifications(): HasMany
	{
		return $this->hasMany(Qualification::class)->latest('obtained_date');
	}

	public function workExperiences(): HasMany
	{
		return $this->hasMany(WorkExperience::class)->latest('start_date');
	}
}
