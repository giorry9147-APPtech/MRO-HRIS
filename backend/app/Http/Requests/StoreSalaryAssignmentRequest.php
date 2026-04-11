<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalaryAssignmentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_id' => ['required', 'exists:employees,id'],
			'pay_scale_id' => ['nullable', 'exists:pay_scales,id'],
			'amount' => ['required', 'numeric', 'min:0'],
			'currency' => ['required', 'string', 'size:3'],
			'start_date' => ['required', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'status' => ['sometimes', 'in:active,ended'],
			'notes' => ['nullable', 'string'],
		];
	}
}