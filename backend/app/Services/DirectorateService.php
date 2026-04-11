<?php

namespace App\Services;

use App\Models\Directorate;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DirectorateService
{
	public function __construct(private readonly UserScopeService $userScopeService)
	{
	}

	public function list(array $filters = [], ?User $user = null): LengthAwarePaginator
	{
		$query = Directorate::query()->latest();

		$this->userScopeService->applyDirectorateScope($query, $user);

		if (!empty($filters['status'])) {
			$query->where('status', $filters['status']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('name', 'like', "%{$search}%")
					->orWhere('code', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Directorate
	{
		return Directorate::create($data);
	}

	public function update(Directorate $directorate, array $data): Directorate
	{
		$directorate->update($data);

		return $directorate->refresh();
	}

	public function delete(Directorate $directorate): void
	{
		$directorate->delete();
	}
}
