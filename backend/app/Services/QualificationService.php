<?php

namespace App\Services;

use App\Models\Qualification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class QualificationService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = Qualification::query()->latest('obtained_date')->latest('id');

		if (!empty($filters['employee_id'])) {
			$query->where('employee_id', $filters['employee_id']);
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Qualification
	{
		return Qualification::create($data);
	}

	public function update(Qualification $qualification, array $data): Qualification
	{
		$qualification->update($data);

		return $qualification->refresh();
	}

	public function delete(Qualification $qualification): void
	{
		$qualification->delete();
	}
}