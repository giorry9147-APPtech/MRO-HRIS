<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EmployeeResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$currentEmployment = $this->relationLoaded('currentEmploymentRecord') ? $this->currentEmploymentRecord : null;
		$currentDepartmentId = $currentEmployment?->department_id ?? $currentEmployment?->position?->department_id;
		$currentDepartmentName = $currentEmployment?->department?->name ?? $currentEmployment?->position?->department?->name;
		$currentDirectorateId = $currentEmployment?->directorate_id ?? $currentEmployment?->department?->directorate_id ?? $currentEmployment?->position?->department?->directorate_id;
		$currentDirectorateName = $currentEmployment?->directorate?->name ?? $currentEmployment?->department?->directorate?->name ?? $currentEmployment?->position?->department?->directorate?->name;

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
			'current_employment' => $currentEmployment ? [
				'id' => $currentEmployment->id,
				'position_id' => $currentEmployment->position_id,
				'position_title' => $currentEmployment->position?->title,
				'job_function_id' => $currentEmployment->job_function_id,
				'job_function_title' => $currentEmployment->jobFunction?->title ?? $currentEmployment->position?->jobFunction?->title,
				'department_id' => $currentDepartmentId,
				'department_name' => $currentDepartmentName,
				'directorate_id' => $currentDirectorateId,
				'directorate_name' => $currentDirectorateName,
				'start_date' => $currentEmployment->start_date?->toDateString(),
				'end_date' => $currentEmployment->end_date?->toDateString(),
				'employment_type' => $currentEmployment->employment_type,
				'status' => $currentEmployment->status,
			] : null,
			'documents_count' => $this->whenCounted('documents'),
			'employment_records_count' => $this->whenCounted('employmentRecords'),
			'asset_assignments_count' => $this->whenCounted('assetAssignments'),
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
