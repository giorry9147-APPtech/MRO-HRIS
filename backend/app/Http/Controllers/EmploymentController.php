<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmploymentRecordRequest;
use App\Http\Requests\UpdateEmploymentRecordRequest;
use App\Http\Resources\EmploymentRecordResource;
use App\Models\EmploymentRecord;
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
			->with(['position.department.directorate', 'position.jobFunction', 'jobFunction'])
			->whereHas('position.department', function ($departmentQuery) use ($request) {
				$this->userScopeService->applyDepartmentScope($departmentQuery, $request->user());
			})
			->when($request->integer('employee_id'), fn ($query, $employeeId) => $query->where('employee_id', $employeeId))
			->when($request->integer('directorate_id'), function ($query, $directorateId) {
				$query->whereHas('position.department', fn ($departmentQuery) => $departmentQuery->where('directorate_id', $directorateId));
			})
			->when($request->integer('department_id'), function ($query, $departmentId) {
				$query->whereHas('position', fn ($positionQuery) => $positionQuery->where('department_id', $departmentId));
			})
			->latest('start_date')
			->paginate((int) ($request->input('per_page', 15)));

		return EmploymentRecordResource::collection($records);
	}

	public function store(StoreEmploymentRecordRequest $request): EmploymentRecordResource
	{
		$record = EmploymentRecord::create([
			...$request->validated(),
			'status' => $request->input('status', 'active'),
		])->load(['position.department.directorate', 'position.jobFunction', 'jobFunction']);

		return new EmploymentRecordResource($record);
	}

	public function update(UpdateEmploymentRecordRequest $request, EmploymentRecord $employmentRecord): EmploymentRecordResource
	{
		$employmentRecord->update($request->validated());
		$employmentRecord->load(['position.department.directorate', 'position.jobFunction', 'jobFunction']);

		return new EmploymentRecordResource($employmentRecord);
	}

	public function destroy(EmploymentRecord $employmentRecord): JsonResponse
	{
		$employmentRecord->delete();

		return response()->json(['message' => 'Employment record deleted.']);
	}
}
