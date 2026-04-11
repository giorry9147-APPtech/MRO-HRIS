<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDirectorateRequest;
use App\Http\Requests\UpdateDirectorateRequest;
use App\Http\Resources\DirectorateResource;
use App\Models\Directorate;
use App\Services\DirectorateService;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectorateController extends Controller
{
	public function __construct(
		private readonly DirectorateService $directorateService,
		private readonly UserScopeService $userScopeService
	)
	{
	}

	public function index(Request $request)
	{
		$directorates = $this->directorateService->list($request->only(['status', 'q', 'per_page']), $request->user());

		return DirectorateResource::collection($directorates);
	}

	public function store(StoreDirectorateRequest $request): DirectorateResource
	{
		$directorate = $this->directorateService->create($request->validated());

		return new DirectorateResource($directorate);
	}

	public function show(Request $request, Directorate $directorate): DirectorateResource
	{
		abort_unless($this->userScopeService->canAccessDirectorate($request->user(), $directorate), 403);

		return new DirectorateResource($directorate);
	}

	public function update(UpdateDirectorateRequest $request, Directorate $directorate): DirectorateResource
	{
		$updatedDirectorate = $this->directorateService->update($directorate, $request->validated());

		return new DirectorateResource($updatedDirectorate);
	}

	public function destroy(Directorate $directorate): JsonResponse
	{
		$this->directorateService->delete($directorate);

		return response()->json(['message' => 'Directorate deleted.']);
	}
}
