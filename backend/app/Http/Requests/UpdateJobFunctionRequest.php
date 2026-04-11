<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobFunctionRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'code' => [
				'nullable',
				'string',
				'max:50',
				Rule::unique('job_functions', 'code')->ignore($this->route('jobFunction')),
			],
			'title' => ['sometimes', 'string', 'max:255'],
			'description' => ['nullable', 'string'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}