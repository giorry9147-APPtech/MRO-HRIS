<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDirectorateRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'name' => ['required', 'string', 'max:120', 'unique:directorates,name'],
			'code' => ['nullable', 'string', 'max:50', 'unique:directorates,code'],
			'description' => ['nullable', 'string'],
			'status' => ['sometimes', 'in:active,inactive'],
		];
	}
}
