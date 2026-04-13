<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Http\Resources\PositionResource;
use App\Models\Position;
use App\Services\PositionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends Controller
{
	public function __construct(private readonly PositionService $positionService)
	{
	}

	public function index(Request $request)
	{
		$positions = $this->positionService->list($request->only(['status', 'q', 'per_page', 'department_id', 'directorate_id', 'job_function_id']));

		return PositionResource::collection($positions);
	}

	public function store(StorePositionRequest $request): PositionResource
	{
		$position = $this->positionService->create($request->validated());

		return new PositionResource($position);
	}

	public function show(Position $position): PositionResource
	{
		$position->load(['department', 'jobFunction']);

		return new PositionResource($position);
	}

	public function update(UpdatePositionRequest $request, Position $position): PositionResource
	{
		$updatedPosition = $this->positionService->update($position, $request->validated());

		return new PositionResource($updatedPosition);
	}

	public function destroy(Position $position): JsonResponse
	{
		$this->positionService->delete($position);

		return response()->json(['message' => 'Position deleted.']);
	}
}
