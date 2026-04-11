<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
	public function __construct(
		private readonly DepartmentService $departmentService,
		private readonly UserScopeService $userScopeService
	)
	{
	}

	public function index(Request $request)
	{
		$departments = $this->departmentService->list(
			$request->only(['status', 'q', 'per_page', 'directorate_id', 'parent_department_id']),
			$request->user()
		);

		return DepartmentResource::collection($departments);
	}

	public function store(StoreDepartmentRequest $request): DepartmentResource
	{
		$department = $this->departmentService->create($request->validated());

		return new DepartmentResource($department);
	}

	public function show(Request $request, Department $department): DepartmentResource
	{
		abort_unless($this->userScopeService->canAccessDepartment($request->user(), $department), 403);

		$department->load(['directorate', 'parentDepartment']);

		return new DepartmentResource($department);
	}

	public function update(UpdateDepartmentRequest $request, Department $department): DepartmentResource
	{
		$updatedDepartment = $this->departmentService->update($department, $request->validated());

		return new DepartmentResource($updatedDepartment);
	}

	public function destroy(Department $department): JsonResponse
	{
		$this->departmentService->delete($department);

		return response()->json(['message' => 'Department deleted.']);
	}
}
