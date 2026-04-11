<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'asset_tag' => [
				'sometimes',
				'string',
				'max:50',
				Rule::unique('assets', 'asset_tag')->ignore($this->route('asset')),
			],
			'name' => ['sometimes', 'string', 'max:120'],
			'category' => ['nullable', 'string', 'max:100'],
			'serial_number' => [
				'nullable',
				'string',
				'max:100',
				Rule::unique('assets', 'serial_number')->ignore($this->route('asset')),
			],
			'status' => ['sometimes', 'in:available,assigned,maintenance,retired'],
			'notes' => ['nullable', 'string'],
		];
	}
}
