<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PositionResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'department_id' => $this->department_id,
			'department_name' => $this->department?->name,
			'job_function_id' => $this->job_function_id,
			'job_function_title' => $this->jobFunction?->title,
			'title' => $this->title,
			'code' => $this->code,
			'grade' => $this->grade,
			'status' => $this->status,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
