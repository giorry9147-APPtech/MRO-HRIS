<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkExperienceRequest;
use App\Http\Requests\UpdateWorkExperienceRequest;
use App\Http\Resources\WorkExperienceResource;
use App\Models\WorkExperience;
use App\Services\WorkExperienceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkExperienceController extends Controller
{
	public function __construct(private readonly WorkExperienceService $workExperienceService)
	{
	}

	public function index(Request $request)
	{
		$experiences = $this->workExperienceService->list($request->only(['employee_id', 'per_page']));

		return WorkExperienceResource::collection($experiences);
	}

	public function store(StoreWorkExperienceRequest $request): WorkExperienceResource
	{
		$experience = $this->workExperienceService->create($request->validated());

		return new WorkExperienceResource($experience);
	}

	public function update(UpdateWorkExperienceRequest $request, WorkExperience $workExperience): WorkExperienceResource
	{
		$updated = $this->workExperienceService->update($workExperience, $request->validated());

		return new WorkExperienceResource($updated);
	}

	public function destroy(WorkExperience $workExperience): JsonResponse
	{
		$this->workExperienceService->delete($workExperience);

		return response()->json(['message' => 'Work experience deleted.']);
	}
}