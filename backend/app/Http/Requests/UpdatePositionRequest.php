<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePositionRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'department_id' => ['nullable', 'exists:departments,id'],
			'job_function_id' => ['nullable', 'exists:job_functions,id'],
			'title' => ['sometimes', 'string', 'max:120'],
			'code' => [
				'nullable',
				'string',
				'max:50',
				Rule::unique('positions', 'code')->ignore($this->route('position')),
			],
			'grade' => ['nullable', 'string', 'max:50'],
			'status' => ['sometimes', 'in:vacant,occupied,frozen,abolished'],
		];
	}
}
