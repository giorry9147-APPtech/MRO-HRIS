<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_number' => [
				'sometimes',
				'string',
				'max:50',
				Rule::unique('employees', 'employee_number')->ignore($this->route('employee')),
			],
			'first_name' => ['sometimes', 'string', 'max:120'],
			'last_name' => ['sometimes', 'string', 'max:120'],
			'email' => ['nullable', 'email', 'max:255'],
			'phone' => ['nullable', 'string', 'max:50'],
			'address' => ['nullable', 'string'],
			'date_joined' => ['nullable', 'date'],
			'status' => ['sometimes', 'in:active,inactive,on_leave,suspended,exited'],
		];
	}
}
