<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetAssignmentRequest;
use App\Http\Resources\AssetAssignmentResource;
use App\Models\Asset;
use App\Models\AssetAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetAssignmentController extends Controller
{
	public function index(Request $request)
	{
		$assignments = AssetAssignment::query()
			->with('asset')
			->when($request->integer('employee_id'), fn ($query, $employeeId) => $query->where('employee_id', $employeeId))
			->latest('assigned_at')
			->paginate((int) ($request->input('per_page', 15)));

		return AssetAssignmentResource::collection($assignments);
	}

	public function store(StoreAssetAssignmentRequest $request): AssetAssignmentResource
	{
		$validated = $request->validated();

		$assignment = AssetAssignment::create([
			...$validated,
			'assigned_at' => $validated['assigned_at'] ?? now(),
			'status' => 'assigned',
		])->load('asset');

		Asset::whereKey($validated['asset_id'])->update(['status' => 'assigned']);

		return new AssetAssignmentResource($assignment);
	}

	public function returnAsset(AssetAssignment $assetAssignment): AssetAssignmentResource
	{
		$assetAssignment->update([
			'returned_at' => now(),
			'status' => 'returned',
		]);

		$assetAssignment->asset()->update(['status' => 'available']);

		return new AssetAssignmentResource($assetAssignment->fresh()->load('asset'));
	}

	public function destroy(AssetAssignment $assetAssignment): JsonResponse
	{
		if ($assetAssignment->status === 'assigned') {
			$assetAssignment->asset()->update(['status' => 'available']);
		}

		$assetAssignment->delete();

		return response()->json(['message' => 'Asset assignment deleted.']);
	}
}
