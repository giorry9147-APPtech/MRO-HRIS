<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QualificationResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'name' => $this->name,
			'institution' => $this->institution,
			'obtained_date' => $this->obtained_date?->toDateString(),
			'expiry_date' => $this->expiry_date?->toDateString(),
			'credential_id' => $this->credential_id,
			'status' => $this->status,
			'notes' => $this->notes,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}