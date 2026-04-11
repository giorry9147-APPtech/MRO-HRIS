<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
		'date_joined',
		'status',
	];

	protected $casts = [
		'date_joined' => 'date',
	];
}
