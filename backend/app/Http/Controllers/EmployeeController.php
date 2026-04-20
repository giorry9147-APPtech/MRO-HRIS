<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
	public function __construct(private readonly EmployeeService $employeeService)
	{
	}

	public function index(Request $request)
	{
		$employees = $this->employeeService->list($request->only(['status', 'q', 'per_page']));

		return EmployeeResource::collection($employees);
	}

	public function store(StoreEmployeeRequest $request): EmployeeResource
	{
		$employee = $this->loadEmployeeRelations(
			$this->employeeService->create($request->validated())
		);

		return new EmployeeResource($employee);
	}

	public function show(Employee $employee): EmployeeResource
	{
		return new EmployeeResource($this->loadEmployeeRelations($employee));
	}

	public function update(UpdateEmployeeRequest $request, Employee $employee): EmployeeResource
	{
		$updatedEmployee = $this->loadEmployeeRelations(
			$this->employeeService->update($employee, $request->validated())
		);

		return new EmployeeResource($updatedEmployee);
	}

	public function destroy(Employee $employee): JsonResponse
	{
		$this->employeeService->delete($employee);

		return response()->json(['message' => 'Employee deleted.']);
	}

	private function loadEmployeeRelations(Employee $employee): Employee
	{
		$employee->loadMissing([
			'currentEmploymentRecord.department.directorate',
			'currentEmploymentRecord.directorate',
			'currentEmploymentRecord.jobFunction',
			'currentEmploymentRecord.position.jobFunction',
			'currentEmploymentRecord.position.department.directorate',
		]);

		return $employee;
	}
}
