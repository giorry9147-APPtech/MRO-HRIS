<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkExperienceRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'company_name' => ['sometimes', 'string', 'max:255'],
			'job_title' => ['sometimes', 'string', 'max:255'],
			'start_date' => ['sometimes', 'date'],
			'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
			'description' => ['nullable', 'string'],
		];
	}
}