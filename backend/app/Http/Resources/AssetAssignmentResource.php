<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetAssignmentResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'asset_id' => $this->asset_id,
			'asset_name' => $this->asset?->name,
			'asset_tag' => $this->asset?->asset_tag,
			'assigned_at' => $this->assigned_at,
			'returned_at' => $this->returned_at,
			'status' => $this->status,
			'notes' => $this->notes,
			'created_at' => $this->created_at,
		];
	}
}