<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetAssignment extends Model
{
	use HasFactory;

	protected $fillable = [
		'employee_id',
		'asset_id',
		'assigned_at',
		'returned_at',
		'status',
		'notes',
	];

	protected $casts = [
		'assigned_at' => 'datetime',
		'returned_at' => 'datetime',
	];

	public function employee(): BelongsTo
	{
		return $this->belongsTo(Employee::class);
	}

	public function asset(): BelongsTo
	{
		return $this->belongsTo(Asset::class);
	}
}
