<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use App\Services\AssetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
	public function __construct(private readonly AssetService $assetService)
	{
	}

	public function index(Request $request)
	{
		$assets = $this->assetService->list($request->only(['status', 'q', 'per_page']));

		return AssetResource::collection($assets);
	}

	public function store(StoreAssetRequest $request): AssetResource
	{
		$asset = $this->assetService->create($request->validated());

		return new AssetResource($asset);
	}

	public function show(Asset $asset): AssetResource
	{
		return new AssetResource($asset);
	}

	public function update(UpdateAssetRequest $request, Asset $asset): AssetResource
	{
		$updatedAsset = $this->assetService->update($asset, $request->validated());

		return new AssetResource($updatedAsset);
	}

	public function destroy(Asset $asset): JsonResponse
	{
		$this->assetService->delete($asset);

		return response()->json(['message' => 'Asset deleted.']);
	}
}
