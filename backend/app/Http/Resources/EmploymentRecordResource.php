<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmploymentRecordResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'position_id' => $this->position_id,
			'position_title' => $this->position?->title,
			'job_function_id' => $this->job_function_id,
			'job_function_title' => $this->jobFunction?->title ?? $this->position?->jobFunction?->title,
			'department_id' => $this->position?->department_id,
			'department_name' => $this->position?->department?->name,
			'directorate_id' => $this->position?->department?->directorate_id,
			'directorate_name' => $this->position?->department?->directorate?->name,
			'start_date' => $this->start_date?->toDateString(),
			'end_date' => $this->end_date?->toDateString(),
			'employment_type' => $this->employment_type,
			'status' => $this->status,
			'notes' => $this->notes,
			'created_at' => $this->created_at,
		];
	}
}