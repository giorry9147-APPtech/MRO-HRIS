<?php

namespace App\Services;

use App\Models\Position;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PositionService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = Position::query()->with(['department.directorate', 'jobFunction'])->latest();

		if (!empty($filters['directorate_id'])) {
			$query->whereHas('department', function ($departmentQuery) use ($filters) {
				$departmentQuery->where('directorate_id', (int) $filters['directorate_id']);
			});
		}

		if (!empty($filters['department_id'])) {
			$query->where('department_id', (int) $filters['department_id']);
		}

		if (!empty($filters['job_function_id'])) {
			$query->where('job_function_id', (int) $filters['job_function_id']);
		}

		if (!empty($filters['status'])) {
			$query->where('status', $filters['status']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('title', 'like', "%{$search}%")
					->orWhere('code', 'like', "%{$search}%")
					->orWhere('grade', 'like', "%{$search}%")
					->orWhereHas('jobFunction', function ($jobFunctionQuery) use ($search) {
						$jobFunctionQuery->where('title', 'like', "%{$search}%");
					});
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Position
	{
		return Position::create($data)->load(['department.directorate', 'jobFunction']);
	}

	public function update(Position $position, array $data): Position
	{
		$position->update($data);

		return $position->refresh()->load(['department.directorate', 'jobFunction']);
	}

	public function delete(Position $position): void
	{
		$position->delete();
	}
}
