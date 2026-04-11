<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSalaryAssignmentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'pay_scale_id' => ['nullable', 'exists:pay_scales,id'],
			'amount' => ['sometimes', 'numeric', 'min:0'],
			'currency' => ['sometimes', 'string', 'size:3'],
			'start_date' => ['sometimes', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'status' => ['sometimes', 'in:active,ended'],
			'notes' => ['nullable', 'string'],
		];
	}
}