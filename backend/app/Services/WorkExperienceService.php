<?php

namespace App\Services;

use App\Models\WorkExperience;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WorkExperienceService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = WorkExperience::query()->latest('start_date')->latest('id');

		if (!empty($filters['employee_id'])) {
			$query->where('employee_id', $filters['employee_id']);
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): WorkExperience
	{
		return WorkExperience::create($data);
	}

	public function update(WorkExperience $workExperience, array $data): WorkExperience
	{
		$workExperience->update($data);

		return $workExperience->refresh();
	}

	public function delete(WorkExperience $workExperience): void
	{
		$workExperience->delete();
	}
}