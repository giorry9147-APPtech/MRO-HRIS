<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\Department;
use App\Models\Directorate;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\EmploymentRecord;
use App\Models\Position;
use App\Models\SalaryAssignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReportService
{
	public function __construct(private readonly UserScopeService $userScopeService)
	{
	}

	public function summary(): array
	{
		return [
			'employees' => Employee::count(),
			'directorates' => Directorate::count(),
			'departments' => Department::count(),
			'positions' => Position::count(),
			'documents' => EmployeeDocument::count(),
			'assets' => Asset::count(),
		];
	}

	public function headcount(): array
	{
		$byStatus = Employee::query()
			->select('status', DB::raw('count(*) as total'))
			->groupBy('status')
			->pluck('total', 'status');

		return [
			'total' => Employee::count(),
			'active' => (int) ($byStatus['active'] ?? 0),
			'inactive' => (int) ($byStatus['inactive'] ?? 0),
			'on_leave' => (int) ($byStatus['on_leave'] ?? 0),
			'suspended' => (int) ($byStatus['suspended'] ?? 0),
			'exited' => (int) ($byStatus['exited'] ?? 0),
		];
	}

	public function byDepartment(): array
	{
		$rows = Department::query()
			->leftJoin('positions', 'positions.department_id', '=', 'departments.id')
			->leftJoin('employment_records', function ($join) {
				$join->on('employment_records.position_id', '=', 'positions.id')
					->where(function ($query) {
						$query->whereNull('employment_records.end_date')
							->orWhereDate('employment_records.end_date', '>=', now()->toDateString());
					});
			})
			->select('departments.id', 'departments.name', DB::raw('count(distinct employment_records.employee_id) as headcount'))
			->groupBy('departments.id', 'departments.name')
			->orderBy('departments.name')
			->get();

		return $rows->map(fn ($row) => [
			'department_id' => $row->id,
			'department_name' => $row->name,
			'headcount' => (int) $row->headcount,
		])->all();
	}

	public function byPayScale(): array
	{
		$rows = DB::table('pay_scales')
			->leftJoin('salary_assignments', function ($join) {
				$join->on('salary_assignments.pay_scale_id', '=', 'pay_scales.id')
					->where(function ($query) {
						$query->whereNull('salary_assignments.end_date')
							->orWhereDate('salary_assignments.end_date', '>=', now()->toDateString());
					});
			})
			->select(
				'pay_scales.id',
				'pay_scales.scale_code',
				'pay_scales.step_number',
				DB::raw('count(distinct salary_assignments.employee_id) as employees')
			)
			->groupBy('pay_scales.id', 'pay_scales.scale_code', 'pay_scales.step_number')
			->orderBy('pay_scales.scale_code')
			->orderBy('pay_scales.step_number')
			->get();

		$assignedEmployeeIds = SalaryAssignment::query()
			->whereNotNull('pay_scale_id')
			->where(function ($query) {
				$query->whereNull('end_date')
					->orWhereDate('end_date', '>=', now()->toDateString());
			})
			->distinct()
			->pluck('employee_id');

		$unassignedCount = Employee::query()
			->whereNotIn('id', $assignedEmployeeIds)
			->where('status', 'active')
			->count();

		return [
			'groups' => $rows->map(fn ($row) => [
				'pay_scale_id' => $row->id,
				'scale_code' => $row->scale_code,
				'step_number' => $row->step_number,
				'employees' => (int) $row->employees,
			])->all(),
			'unassigned_active_employees' => $unassignedCount,
		];
	}

	public function assets(): array
	{
		$byStatus = Asset::query()
			->select('status', DB::raw('count(*) as total'))
			->groupBy('status')
			->pluck('total', 'status');

		$assignedNow = DB::table('asset_assignments')
			->whereNull('returned_at')
			->count();

		return [
			'total_assets' => Asset::count(),
			'assigned_now' => $assignedNow,
			'available' => (int) ($byStatus['available'] ?? 0),
			'assigned' => (int) ($byStatus['assigned'] ?? 0),
			'under_maintenance' => (int) ($byStatus['under_maintenance'] ?? 0),
			'retired' => (int) ($byStatus['retired'] ?? 0),
			'lost' => (int) ($byStatus['lost'] ?? 0),
		];
	}

	public function incompleteDossiers(): array
	{
		$employeeIdsMissingDocuments = Employee::query()
			->where('status', 'active')
			->whereDoesntHave('documents')
			->pluck('id');

		$employeeIdsMissingEmployment = Employee::query()
			->where('status', 'active')
			->whereDoesntHave('employmentRecords', function ($query) {
				$query->where(function ($inner) {
					$inner->whereNull('end_date')
						->orWhereDate('end_date', '>=', now()->toDateString());
				});
			})
			->pluck('id');

		$employeeIdsMissingSalary = Employee::query()
			->where('status', 'active')
			->whereDoesntHave('salaryAssignments', function ($query) {
				$query->where(function ($inner) {
					$inner->whereNull('end_date')
						->orWhereDate('end_date', '>=', now()->toDateString());
				});
			})
			->pluck('id');

		$combinedIds = $employeeIdsMissingDocuments
			->merge($employeeIdsMissingEmployment)
			->merge($employeeIdsMissingSalary)
			->unique()
			->values();

		$employees = Employee::query()
			->whereIn('id', $combinedIds)
			->orderBy('last_name')
			->orderBy('first_name')
			->get()
			->map(fn ($employee) => [
				'id' => $employee->id,
				'employee_number' => $employee->employee_number,
				'name' => trim($employee->first_name.' '.$employee->last_name),
				'status' => $employee->status,
				'missing_documents' => $employeeIdsMissingDocuments->contains($employee->id),
				'missing_active_employment' => $employeeIdsMissingEmployment->contains($employee->id),
				'missing_active_salary' => $employeeIdsMissingSalary->contains($employee->id),
			])
			->all();

		return [
			'total_incomplete' => count($employees),
			'employees' => $employees,
		];
	}

	public function staffByDepartment(?User $user = null): array
	{
		$departmentsQuery = Department::query()->with('directorate')->orderBy('name');
		$this->userScopeService->applyDepartmentScope($departmentsQuery, $user);

		$departments = $departmentsQuery->get()->keyBy('id');
		if ($departments->isEmpty()) {
			return [];
		}

		$records = EmploymentRecord::query()
			->with(['employee', 'position.department.directorate'])
			->where(function ($query) {
				$query->whereNull('end_date')
					->orWhereDate('end_date', '>=', now()->toDateString());
			})
			->whereHas('position', function ($query) use ($departments) {
				$query->whereIn('department_id', $departments->keys()->all());
			})
			->latest('start_date')
			->get();

		$grouped = [];
		foreach ($records as $record) {
			$department = $record->position?->department;
			$employee = $record->employee;
			if (! $department || ! $employee) {
				continue;
			}

			$deptId = $department->id;
			if (! isset($grouped[$deptId])) {
				$grouped[$deptId] = [
					'department_id' => $department->id,
					'department_name' => $department->name,
					'directorate_id' => $department->directorate_id,
					'directorate_name' => $department->directorate?->name,
					'headcount' => 0,
					'employees' => [],
				];
			}

			$grouped[$deptId]['employees'][] = [
				'employee_id' => $employee->id,
				'employee_number' => $employee->employee_number,
				'name' => trim($employee->first_name.' '.$employee->last_name),
				'position_id' => $record->position_id,
				'position_title' => $record->position?->title,
				'employment_type' => $record->employment_type,
				'start_date' => optional($record->start_date)->toDateString(),
			];
		}

		foreach ($grouped as $deptId => $row) {
			$uniqueEmployeeIds = collect($row['employees'])->pluck('employee_id')->unique();
			$grouped[$deptId]['headcount'] = $uniqueEmployeeIds->count();
		}

		return array_values($grouped);
	}
}