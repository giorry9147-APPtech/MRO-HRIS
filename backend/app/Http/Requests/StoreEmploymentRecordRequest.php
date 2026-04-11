<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmploymentRecordRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_id' => ['required', 'exists:employees,id'],
			'position_id' => ['nullable', 'exists:positions,id'],
			'start_date' => ['required', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'employment_type' => ['required', 'string', 'max:50'],
			'status' => ['sometimes', 'in:active,inactive,ended'],
			'notes' => ['nullable', 'string'],
		];
	}
}