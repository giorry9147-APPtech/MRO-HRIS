<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:120', 'unique:departments,name'],
			'code' => ['nullable', 'string', 'max:50', 'unique:departments,code'],
			'status' => ['sometimes', 'in:active,inactive'],
		];
	}
}
