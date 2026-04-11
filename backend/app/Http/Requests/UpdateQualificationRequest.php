<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQualificationRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'name' => ['sometimes', 'string', 'max:255'],
			'institution' => ['nullable', 'string', 'max:255'],
			'obtained_date' => ['nullable', 'date'],
			'expiry_date' => ['nullable', 'date', 'after_or_equal:obtained_date'],
			'credential_id' => ['nullable', 'string', 'max:120'],
			'status' => ['sometimes', 'in:valid,expired,revoked,pending'],
			'notes' => ['nullable', 'string'],
		];
	}
}