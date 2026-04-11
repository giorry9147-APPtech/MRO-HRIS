<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobFunctionRequest;
use App\Http\Requests\UpdateJobFunctionRequest;
use App\Http\Resources\JobFunctionResource;
use App\Models\JobFunction;
use App\Services\JobFunctionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobFunctionController extends Controller
{
	public function __construct(private readonly JobFunctionService $jobFunctionService)
	{
	}

	public function index(Request $request)
	{
		$jobFunctions = $this->jobFunctionService->list($request->only(['is_active', 'q', 'per_page']));

		return JobFunctionResource::collection($jobFunctions);
	}

	public function store(StoreJobFunctionRequest $request): JobFunctionResource
	{
		$jobFunction = $this->jobFunctionService->create($request->validated());

		return new JobFunctionResource($jobFunction);
	}

	public function show(JobFunction $jobFunction): JobFunctionResource
	{
		return new JobFunctionResource($jobFunction);
	}

	public function update(UpdateJobFunctionRequest $request, JobFunction $jobFunction): JobFunctionResource
	{
		$updatedJobFunction = $this->jobFunctionService->update($jobFunction, $request->validated());

		return new JobFunctionResource($updatedJobFunction);
	}

	public function destroy(JobFunction $jobFunction): JsonResponse
	{
		$this->jobFunctionService->delete($jobFunction);

		return response()->json(['message' => 'Job function deleted.']);
	}
}
