<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDocument extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_id',
		'title',
		'document_type',
		'original_name',
		'file_path',
		'mime_type',
		'file_size',
		'uploaded_at',
	];

	protected $casts = [
		'uploaded_at' => 'datetime',
	];

	public function employee(): BelongsTo
	{
		return $this->belongsTo(Employee::class);
	}
}
