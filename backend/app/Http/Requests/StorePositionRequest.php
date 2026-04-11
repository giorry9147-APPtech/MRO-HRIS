<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePositionRequest extends FormRequest
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
			'title' => ['required', 'string', 'max:120'],
			'code' => ['nullable', 'string', 'max:50', 'unique:positions,code'],
			'grade' => ['nullable', 'string', 'max:50'],
			'status' => ['sometimes', 'in:vacant,occupied,frozen,abolished'],
		];
	}
}
