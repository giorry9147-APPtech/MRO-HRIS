<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_number' => ['required', 'string', 'max:50', 'unique:employees,employee_number'],
			'first_name' => ['required', 'string', 'max:120'],
			'last_name' => ['required', 'string', 'max:120'],
			'email' => ['nullable', 'email', 'max:255'],
			'phone' => ['nullable', 'string', 'max:50'],
			'address' => ['nullable', 'string'],
			'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
			'date_joined' => ['nullable', 'date'],
			'status' => ['sometimes', 'in:active,inactive,on_leave,suspended,exited'],
		];
	}
}
