<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmploymentRecordRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'position_id' => ['nullable', 'exists:positions,id'],
			'job_function_id' => ['nullable', 'exists:job_functions,id'],
			'start_date' => ['sometimes', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'employment_type' => ['sometimes', 'string', 'max:50'],
			'status' => ['sometimes', 'in:active,inactive,ended'],
			'notes' => ['nullable', 'string'],
		];
	}
}
