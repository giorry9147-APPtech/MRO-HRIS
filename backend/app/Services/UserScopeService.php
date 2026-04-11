<?php

namespace App\Services;

use App\Models\Directorate;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserScopeService
{
	public function applyDirectorateScope(Builder $query, ?User $user, string $directorateColumn = 'id'): void
	{
		if (! $user || $this->hasGlobalScope($user)) {
			return;
		}

		if ($user->scope_type === 'directorates') {
			$ids = $this->sanitizeIds($user->allowed_directorate_ids ?? []);
			if (empty($ids)) {
				$query->whereRaw('1 = 0');
				return;
			}

			$query->whereIn($directorateColumn, $ids);
			return;
		}

		$departmentIds = $this->sanitizeIds($user->allowed_department_ids ?? []);
		if (empty($departmentIds)) {
			$query->whereRaw('1 = 0');
			return;
		}

		$directorateIds = Department::query()
			->whereIn('id', $departmentIds)
			->whereNotNull('directorate_id')
			->distinct()
			->pluck('directorate_id')
			->all();

		if (empty($directorateIds)) {
			$query->whereRaw('1 = 0');
			return;
		}

		$query->whereIn($directorateColumn, $directorateIds);
	}

	public function applyDepartmentScope(
		Builder $query,
		?User $user,
		string $departmentIdColumn = 'id',
		string $directorateIdColumn = 'directorate_id'
	): void {
		if (! $user || $this->hasGlobalScope($user)) {
			return;
		}

		if ($user->scope_type === 'directorates') {
			$directorateIds = $this->sanitizeIds($user->allowed_directorate_ids ?? []);
			if (empty($directorateIds)) {
				$query->whereRaw('1 = 0');
				return;
			}

			$query->whereIn($directorateIdColumn, $directorateIds);
			return;
		}

		$departmentIds = $this->sanitizeIds($user->allowed_department_ids ?? []);
		if (empty($departmentIds)) {
			$query->whereRaw('1 = 0');
			return;
		}

		$query->whereIn($departmentIdColumn, $departmentIds);
	}

	public function hasGlobalScope(User $user): bool
	{
		return ($user->scope_type ?? 'all') === 'all';
	}

	public function canAccessDepartment(?User $user, Department $department): bool
	{
		if (! $user || $this->hasGlobalScope($user)) {
			return true;
		}

		if ($user->scope_type === 'directorates') {
			$directorateIds = $this->sanitizeIds($user->allowed_directorate_ids ?? []);
			return in_array((int) $department->directorate_id, $directorateIds, true);
		}

		$departmentIds = $this->sanitizeIds($user->allowed_department_ids ?? []);
		return in_array((int) $department->id, $departmentIds, true);
	}

	public function canAccessDirectorate(?User $user, Directorate $directorate): bool
	{
		if (! $user || $this->hasGlobalScope($user)) {
			return true;
		}

		if ($user->scope_type === 'directorates') {
			$directorateIds = $this->sanitizeIds($user->allowed_directorate_ids ?? []);
			return in_array((int) $directorate->id, $directorateIds, true);
		}

		$departmentIds = $this->sanitizeIds($user->allowed_department_ids ?? []);
		if (empty($departmentIds)) {
			return false;
		}

		return Department::query()
			->whereIn('id', $departmentIds)
			->where('directorate_id', $directorate->id)
			->exists();
	}

	private function sanitizeIds(array $ids): array
	{
		return array_values(array_filter(array_map(static fn ($id) => (int) $id, $ids), static fn ($id) => $id > 0));
	}
}
