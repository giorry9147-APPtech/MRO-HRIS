<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayScaleRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'scale_code' => ['sometimes', 'string', 'max:50'],
			'step_number' => ['sometimes', 'integer', 'min:1'],
			'amount' => ['sometimes', 'numeric', 'min:0'],
			'currency' => ['sometimes', 'string', 'size:3'],
			'allowance_notes' => ['nullable', 'string'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}