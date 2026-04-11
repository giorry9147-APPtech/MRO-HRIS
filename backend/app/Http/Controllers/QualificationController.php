<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQualificationRequest;
use App\Http\Requests\UpdateQualificationRequest;
use App\Http\Resources\QualificationResource;
use App\Models\Qualification;
use App\Services\QualificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QualificationController extends Controller
{
	public function __construct(private readonly QualificationService $qualificationService)
	{
	}

	public function index(Request $request)
	{
		$qualifications = $this->qualificationService->list($request->only(['employee_id', 'per_page']));

		return QualificationResource::collection($qualifications);
	}

	public function store(StoreQualificationRequest $request): QualificationResource
	{
		$qualification = $this->qualificationService->create($request->validated());

		return new QualificationResource($qualification);
	}

	public function update(UpdateQualificationRequest $request, Qualification $qualification): QualificationResource
	{
		$updated = $this->qualificationService->update($qualification, $request->validated());

		return new QualificationResource($updated);
	}

	public function destroy(Qualification $qualification): JsonResponse
	{
		$this->qualificationService->delete($qualification);

		return response()->json(['message' => 'Qualification deleted.']);
	}
}
