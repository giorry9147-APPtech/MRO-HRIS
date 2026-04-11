<?php

namespace App\Services;

use App\Models\PayScale;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PayScaleService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = PayScale::query()->latest();

		if (array_key_exists('is_active', $filters) && $filters['is_active'] !== null && $filters['is_active'] !== '') {
			$query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? false);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('scale_code', 'like', "%{$search}%")
					->orWhere('step_number', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): PayScale
	{
		return PayScale::create($data);
	}

	public function update(PayScale $payScale, array $data): PayScale
	{
		$payScale->update($data);

		return $payScale->refresh();
	}

	public function delete(PayScale $payScale): void
	{
		$payScale->delete();
	}
}