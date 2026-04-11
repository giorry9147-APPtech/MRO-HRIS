<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobFunctionRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'code' => ['nullable', 'string', 'max:50', 'unique:job_functions,code'],
			'title' => ['required', 'string', 'max:255'],
			'description' => ['nullable', 'string'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}