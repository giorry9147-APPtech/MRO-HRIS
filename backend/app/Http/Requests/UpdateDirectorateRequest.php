<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDirectorateRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'name' => [
				'sometimes',
				'string',
				'max:120',
				Rule::unique('directorates', 'name')->ignore($this->route('directorate')),
			],
			'code' => [
				'nullable',
				'string',
				'max:50',
				Rule::unique('directorates', 'code')->ignore($this->route('directorate')),
			],
			'description' => ['nullable', 'string'],
			'status' => ['sometimes', 'in:active,inactive'],
		];
	}
}
