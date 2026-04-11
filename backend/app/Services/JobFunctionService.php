<?php

namespace App\Services;

use App\Models\JobFunction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JobFunctionService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = JobFunction::query()->latest();

		if (array_key_exists('is_active', $filters) && $filters['is_active'] !== null && $filters['is_active'] !== '') {
			$query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? false);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('title', 'like', "%{$search}%")
					->orWhere('code', 'like', "%{$search}%")
					->orWhere('description', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): JobFunction
	{
		return JobFunction::create($data);
	}

	public function update(JobFunction $jobFunction, array $data): JobFunction
	{
		$jobFunction->update($data);

		return $jobFunction->refresh();
	}

	public function delete(JobFunction $jobFunction): void
	{
		$jobFunction->delete();
	}
}