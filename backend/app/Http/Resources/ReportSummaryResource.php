<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportSummaryResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'employees' => $this['employees'],
			'directorates' => $this['directorates'],
			'departments' => $this['departments'],
			'positions' => $this['positions'],
			'documents' => $this['documents'],
			'assets' => $this['assets'],
		];
	}
}
