<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = Employee::query()->latest();

		if (!empty($filters['status'])) {
			$query->where('status', $filters['status']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('employee_number', 'like', "%{$search}%")
					->orWhere('first_name', 'like', "%{$search}%")
					->orWhere('last_name', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): Employee
	{
		if (isset($data['profile_photo']) && $data['profile_photo'] instanceof UploadedFile) {
			$data['profile_photo_path'] = $data['profile_photo']->store('employee-photos', 'public');
			unset($data['profile_photo']);
		}

		return Employee::create($data);
	}

	public function update(Employee $employee, array $data): Employee
	{
		if (isset($data['profile_photo']) && $data['profile_photo'] instanceof UploadedFile) {
			if ($employee->profile_photo_path) {
				Storage::disk('public')->delete($employee->profile_photo_path);
			}

			$data['profile_photo_path'] = $data['profile_photo']->store('employee-photos', 'public');
			unset($data['profile_photo']);
		}

		$employee->update($data);

		return $employee->refresh();
	}

	public function delete(Employee $employee): void
	{
		if ($employee->profile_photo_path) {
			Storage::disk('public')->delete($employee->profile_photo_path);
		}

		$employee->delete();
	}
}
