<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'directorate_id' => ['nullable', 'exists:directorates,id'],
			'parent_department_id' => ['nullable', 'exists:departments,id'],
			'name' => [
				'sometimes',
				'string',
				'max:120',
				Rule::unique('departments', 'name')->ignore($this->route('department')),
			],
			'code' => [
				'nullable',
				'string',
				'max:50',
				Rule::unique('departments', 'code')->ignore($this->route('department')),
			],
			'status' => ['sometimes', 'in:active,inactive'],
		];
	}
}
