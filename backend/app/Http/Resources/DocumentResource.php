<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'employee_name' => $this->employee ? trim($this->employee->first_name.' '.$this->employee->last_name) : null,
			'title' => $this->title,
			'document_type' => $this->document_type,
			'original_name' => $this->original_name,
			'mime_type' => $this->mime_type,
			'file_size' => $this->file_size,
			'uploaded_at' => $this->uploaded_at,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
