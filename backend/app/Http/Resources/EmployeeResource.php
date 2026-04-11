<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EmployeeResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_number' => $this->employee_number,
			'first_name' => $this->first_name,
			'last_name' => $this->last_name,
			'email' => $this->email,
			'phone' => $this->phone,
			'address' => $this->address,
			'profile_photo_url' => $this->profile_photo_path ? Storage::disk('public')->url($this->profile_photo_path) : null,
			'date_joined' => $this->date_joined?->toDateString(),
			'status' => $this->status,
			'documents_count' => $this->whenCounted('documents'),
			'employment_records_count' => $this->whenCounted('employmentRecords'),
			'asset_assignments_count' => $this->whenCounted('assetAssignments'),
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
