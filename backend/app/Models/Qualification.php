<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Qualification extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_id',
		'name',
		'institution',
		'obtained_date',
		'expiry_date',
		'credential_id',
		'status',
		'notes',
	];

	protected $casts = [
		'obtained_date' => 'date',
		'expiry_date' => 'date',
	];

	public function employee(): BelongsTo
	{
		return $this->belongsTo(Employee::class);
	}
}
