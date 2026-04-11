<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserScopeRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'scope_type' => ['required', 'in:all,directorates,departments'],
			'allowed_directorate_ids' => ['nullable', 'array'],
			'allowed_directorate_ids.*' => ['integer', 'exists:directorates,id'],
			'allowed_department_ids' => ['nullable', 'array'],
			'allowed_department_ids.*' => ['integer', 'exists:departments,id'],
		];
	}
}
