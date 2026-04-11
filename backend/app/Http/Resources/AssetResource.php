<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'asset_tag' => $this->asset_tag,
			'name' => $this->name,
			'category' => $this->category,
			'serial_number' => $this->serial_number,
			'status' => $this->status,
			'notes' => $this->notes,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
