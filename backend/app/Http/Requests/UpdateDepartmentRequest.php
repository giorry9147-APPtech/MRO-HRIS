<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
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
			'name' => ['sometimes', 'string', 'max:120'],
			'code' => [
				'nullable',
				'string',
				'max:50',
				\Illuminate\Validation\Rule::unique('departments', 'code')->ignore($this->route('department')),
			],
			'status' => ['sometimes', 'in:active,inactive'],
		];
	}
}
