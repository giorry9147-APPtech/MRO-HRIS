<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayScaleResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'scale_code' => $this->scale_code,
			'step_number' => $this->step_number,
			'amount' => $this->amount,
			'currency' => $this->currency,
			'allowance_notes' => $this->allowance_notes,
			'is_active' => (bool) $this->is_active,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}