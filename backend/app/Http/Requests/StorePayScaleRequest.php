<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayScaleRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'scale_code' => ['required', 'string', 'max:50'],
			'step_number' => ['required', 'integer', 'min:1'],
			'amount' => ['required', 'numeric', 'min:0'],
			'currency' => ['sometimes', 'string', 'size:3'],
			'allowance_notes' => ['nullable', 'string'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}