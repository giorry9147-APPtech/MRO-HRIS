<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'directorate_id' => $this->directorate_id,
			'directorate_name' => $this->directorate?->name,
			'parent_department_id' => $this->parent_department_id,
			'parent_department_name' => $this->parentDepartment?->name,
			'name' => $this->name,
			'code' => $this->code,
			'status' => $this->status,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
