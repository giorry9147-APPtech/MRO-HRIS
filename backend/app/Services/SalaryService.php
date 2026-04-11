<?php

namespace App\Services;

use App\Models\SalaryAssignment;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class SalaryService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = SalaryAssignment::query()->with('payScale')->latest('start_date');

		if (!empty($filters['employee_id'])) {
			$query->where('employee_id', $filters['employee_id']);
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): SalaryAssignment
	{
		$this->ensureNoOverlappingAssignment($data['employee_id'], $data['start_date'], $data['end_date'] ?? null);

		return SalaryAssignment::create($data)->load('payScale');
	}

	public function update(SalaryAssignment $salaryAssignment, array $data): SalaryAssignment
	{
		$startDate = $data['start_date'] ?? $salaryAssignment->start_date?->toDateString();
		$endDate = array_key_exists('end_date', $data) ? $data['end_date'] : $salaryAssignment->end_date?->toDateString();

		$this->ensureNoOverlappingAssignment($salaryAssignment->employee_id, $startDate, $endDate, $salaryAssignment->id);

		$salaryAssignment->update($data);

		return $salaryAssignment->refresh()->load('payScale');
	}

	public function delete(SalaryAssignment $salaryAssignment): void
	{
		$salaryAssignment->delete();
	}

	private function ensureNoOverlappingAssignment(int $employeeId, string $startDate, ?string $endDate, ?int $ignoreId = null): void
	{
		$start = Carbon::parse($startDate)->startOfDay();
		$end = $endDate ? Carbon::parse($endDate)->endOfDay() : null;

		$overlapExists = SalaryAssignment::query()
			->where('employee_id', $employeeId)
			->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
			->where(function ($query) use ($start, $end) {
				$query->where(function ($inner) use ($start, $end) {
					$inner->whereDate('start_date', '<=', $end?->toDateString() ?? '9999-12-31')
						->where(function ($endDateQuery) use ($start) {
							$endDateQuery->whereNull('end_date')
								->orWhereDate('end_date', '>=', $start->toDateString());
						});
				});
			})
			->exists();

		if ($overlapExists) {
			throw ValidationException::withMessages([
				'start_date' => 'Salary assignment period overlaps with an existing record for this employee.',
			]);
		}
	}
}
