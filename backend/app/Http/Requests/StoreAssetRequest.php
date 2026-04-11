<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'asset_tag' => ['required', 'string', 'max:50', 'unique:assets,asset_tag'],
			'name' => ['required', 'string', 'max:120'],
			'category' => ['nullable', 'string', 'max:100'],
			'serial_number' => ['nullable', 'string', 'max:100', 'unique:assets,serial_number'],
			'status' => ['sometimes', 'in:available,assigned,maintenance,retired'],
			'notes' => ['nullable', 'string'],
		];
	}
}
