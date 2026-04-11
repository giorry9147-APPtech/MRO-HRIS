<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'employee_id' => ['nullable', 'exists:employees,id'],
			'title' => ['required', 'string', 'max:120'],
			'document_type' => ['required', 'string', 'max:100'],
			'file' => ['required', 'file', 'max:10240'],
		];
	}
}
