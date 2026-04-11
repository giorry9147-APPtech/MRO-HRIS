<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalaryAssignmentRequest;
use App\Http\Requests\UpdateSalaryAssignmentRequest;
use App\Http\Resources\SalaryAssignmentResource;
use App\Models\SalaryAssignment;
use App\Services\SalaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
	public function __construct(private readonly SalaryService $salaryService)
	{
	}

	public function index(Request $request)
	{
		$assignments = $this->salaryService->list($request->only(['employee_id', 'per_page']));

		return SalaryAssignmentResource::collection($assignments);
	}

	public function store(StoreSalaryAssignmentRequest $request): SalaryAssignmentResource
	{
		$assignment = $this->salaryService->create($request->validated());

		return new SalaryAssignmentResource($assignment);
	}

	public function update(UpdateSalaryAssignmentRequest $request, SalaryAssignment $salaryAssignment): SalaryAssignmentResource
	{
		$updated = $this->salaryService->update($salaryAssignment, $request->validated());

		return new SalaryAssignmentResource($updated);
	}

	public function destroy(SalaryAssignment $salaryAssignment): JsonResponse
	{
		$this->salaryService->delete($salaryAssignment);

		return response()->json(['message' => 'Salary assignment deleted.']);
	}
}
