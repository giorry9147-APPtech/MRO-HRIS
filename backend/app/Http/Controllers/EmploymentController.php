<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmploymentRecordRequest;
use App\Http\Requests\UpdateEmploymentRecordRequest;
use App\Http\Resources\EmploymentRecordResource;
use App\Models\Department;
use App\Models\EmploymentRecord;
use App\Models\Position;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmploymentController extends Controller
{
	public function __construct(private readonly UserScopeService $userScopeService)
	{
	}

	public function index(Request $request)
	{
		$records = EmploymentRecord::query()
			->with(['position.department.directorate', 'position.jobFunction', 'jobFunction', 'department.directorate', 'directorate'])
			->where(function ($scopeQuery) use ($request) {
				$scopeQuery
					->whereHas('position.department', function ($departmentQuery) use ($request) {
						$this->userScopeService->applyDepartmentScope($departmentQuery, $request->user());
					})
					->orWhere(function ($directDepartmentScopeQuery) use ($request) {
						$this->userScopeService->applyDepartmentScope(
							$directDepartmentScopeQuery,
							$request->user(),
							'department_id',
							'directorate_id'
						);
					});
			})
			->when($request->integer('employee_id'), fn ($query, $employeeId) => $query->where('employee_id', $employeeId))
			->when($request->integer('directorate_id'), function ($query, $directorateId) {
				$query->where(function ($innerQuery) use ($directorateId) {
					$innerQuery
						->where('directorate_id', $directorateId)
						->orWhereHas('department', fn ($departmentQuery) => $departmentQuery->where('directorate_id', $directorateId))
						->orWhereHas('position.department', fn ($departmentQuery) => $departmentQuery->where('directorate_id', $directorateId));
				});
			})
			->when($request->integer('department_id'), function ($query, $departmentId) {
				$query->where(function ($innerQuery) use ($departmentId) {
					$innerQuery
						->where('department_id', $departmentId)
						->orWhereHas('position', fn ($positionQuery) => $positionQuery->where('department_id', $departmentId));
				});
			})
			->latest('start_date')
			->paginate((int) ($request->input('per_page', 15)));

		return EmploymentRecordResource::collection($records);
	}

	public function store(StoreEmploymentRecordRequest $request): EmploymentRecordResource
	{
		$payload = $request->validated();

		if (!empty($payload['department_id'])) {
			$department = Department::query()->select(['id', 'directorate_id'])->find($payload['department_id']);
			if ($department && empty($payload['directorate_id'])) {
				$payload['directorate_id'] = $department->directorate_id;
			}
		}

		if (!empty($payload['position_id'])) {
			$position = Position::query()->with('department')->find($payload['position_id']);
			if ($position && empty($payload['department_id'])) {
				$payload['department_id'] = $position->department_id;
			}
			if ($position && $position->department && empty($payload['directorate_id'])) {
				$payload['directorate_id'] = $position->department->directorate_id;
			}
		}

		$record = EmploymentRecord::create([
			...$payload,
			'status' => $request->input('status', 'active'),
		])->load(['position.department.directorate', 'position.jobFunction', 'jobFunction', 'department.directorate', 'directorate']);

		return new EmploymentRecordResource($record);
	}

	public function update(UpdateEmploymentRecordRequest $request, EmploymentRecord $employmentRecord): EmploymentRecordResource
	{
		$payload = $request->validated();

		if (!empty($payload['department_id'])) {
			$department = Department::query()->select(['id', 'directorate_id'])->find($payload['department_id']);
			if ($department && empty($payload['directorate_id'])) {
				$payload['directorate_id'] = $department->directorate_id;
			}
		}

		if (!empty($payload['position_id'])) {
			$position = Position::query()->with('department')->find($payload['position_id']);
			if ($position && empty($payload['department_id'])) {
				$payload['department_id'] = $position->department_id;
			}
			if ($position && $position->department && empty($payload['directorate_id'])) {
				$payload['directorate_id'] = $position->department->directorate_id;
			}
		}

		$employmentRecord->update($payload);
		$employmentRecord->load(['position.department.directorate', 'position.jobFunction', 'jobFunction', 'department.directorate', 'directorate']);

		return new EmploymentRecordResource($employmentRecord);
	}

	public function destroy(EmploymentRecord $employmentRecord): JsonResponse
	{
		$employmentRecord->delete();

		return response()->json(['message' => 'Employment record deleted.']);
	}
}
