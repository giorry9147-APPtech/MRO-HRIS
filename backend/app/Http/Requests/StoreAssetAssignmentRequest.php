<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetAssignmentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_id' => ['required', 'exists:employees,id'],
			'asset_id' => ['required', 'exists:assets,id'],
			'assigned_at' => ['nullable', 'date'],
			'notes' => ['nullable', 'string'],
		];
	}
}