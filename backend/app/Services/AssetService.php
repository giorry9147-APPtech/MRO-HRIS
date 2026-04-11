<?php

namespace App\Services;

use App\Models\Asset;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AssetService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = Asset::query()->latest();

		if (!empty($filters['status'])) {
			$query->where('status', $filters['status']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('asset_tag', 'like', "%{$search}%")
					->orWhere('name', 'like', "%{$search}%")
					->orWhere('serial_number', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Asset
	{
		return Asset::create($data);
	}

	public function update(Asset $asset, array $data): Asset
	{
		$asset->update($data);

		return $asset->refresh();
	}

	public function delete(Asset $asset): void
	{
		$asset->delete();
	}
}
