<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkExperienceResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'company_name' => $this->company_name,
			'job_title' => $this->job_title,
			'start_date' => $this->start_date?->toDateString(),
			'end_date' => $this->end_date?->toDateString(),
			'description' => $this->description,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}