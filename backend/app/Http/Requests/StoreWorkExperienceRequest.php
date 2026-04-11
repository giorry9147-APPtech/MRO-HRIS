<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkExperienceRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_id' => ['required', 'exists:employees,id'],
			'company_name' => ['required', 'string', 'max:255'],
			'job_title' => ['required', 'string', 'max:255'],
			'start_date' => ['required', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'description' => ['nullable', 'string'],
		];
	}
}