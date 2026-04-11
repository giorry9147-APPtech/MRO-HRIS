<?php

namespace App\Services;

use App\Models\Department;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DepartmentService
{
	public function __construct(private readonly UserScopeService $userScopeService)
	{
	}

	public function list(array $filters = [], ?User $user = null): LengthAwarePaginator
	{
		$query = Department::query()->with(['directorate', 'parentDepartment'])->latest();

		$this->userScopeService->applyDepartmentScope($query, $user);

		if (!empty($filters['status'])) {
			$query->where('status', $filters['status']);
		}

		if (!empty($filters['directorate_id'])) {
			$query->where('directorate_id', (int) $filters['directorate_id']);
		}

		if (array_key_exists('parent_department_id', $filters) && $filters['parent_department_id'] !== null && $filters['parent_department_id'] !== '') {
			$query->where('parent_department_id', (int) $filters['parent_department_id']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('name', 'like', "%{$search}%")
					->orWhere('code', 'like', "%{$search}%")
					->orWhereHas('directorate', function ($directorateQuery) use ($search) {
						$directorateQuery->where('name', 'like', "%{$search}%");
					});
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Department
	{
		return Department::create($data)->load(['directorate', 'parentDepartment']);
	}

	public function update(Department $department, array $data): Department
	{
		$department->update($data);

		return $department->refresh()->load(['directorate', 'parentDepartment']);
	}

	public function delete(Department $department): void
	{
		$department->delete();
	}
}
