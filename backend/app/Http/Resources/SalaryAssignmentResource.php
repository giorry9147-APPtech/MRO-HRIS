<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalaryAssignmentResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'employee_id' => $this->employee_id,
			'pay_scale_id' => $this->pay_scale_id,
			'pay_scale_code' => $this->payScale?->scale_code,
			'pay_scale_step' => $this->payScale?->step_number,
			'amount' => $this->amount,
			'currency' => $this->currency,
			'start_date' => $this->start_date?->toDateString(),
			'end_date' => $this->end_date?->toDateString(),
			'status' => $this->status,
			'notes' => $this->notes,
			'created_at' => $this->created_at,
		];
	}
}