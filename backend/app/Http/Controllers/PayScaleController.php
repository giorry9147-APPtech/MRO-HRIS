<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayScaleRequest;
use App\Http\Requests\UpdatePayScaleRequest;
use App\Http\Resources\PayScaleResource;
use App\Models\PayScale;
use App\Services\PayScaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayScaleController extends Controller
{
	public function __construct(private readonly PayScaleService $payScaleService)
	{
	}

	public function index(Request $request)
	{
		$payScales = $this->payScaleService->list($request->only(['is_active', 'q', 'per_page']));

		return PayScaleResource::collection($payScales);
	}

	public function store(StorePayScaleRequest $request): PayScaleResource
	{
		$payScale = $this->payScaleService->create($request->validated());

		return new PayScaleResource($payScale);
	}

	public function show(PayScale $payScale): PayScaleResource
	{
		return new PayScaleResource($payScale);
	}

	public function update(UpdatePayScaleRequest $request, PayScale $payScale): PayScaleResource
	{
		$updatedPayScale = $this->payScaleService->update($payScale, $request->validated());

		return new PayScaleResource($updatedPayScale);
	}

	public function destroy(PayScale $payScale): JsonResponse
	{
		$this->payScaleService->delete($payScale);

		return response()->json(['message' => 'Pay scale deleted.']);
	}
}