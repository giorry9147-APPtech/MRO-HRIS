<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportSummaryResource;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
	public function __construct(private readonly ReportService $reportService)
	{
	}

	public function summary(): ReportSummaryResource
	{
		return new ReportSummaryResource($this->reportService->summary());
	}

	public function headcount(): JsonResponse
	{
		return response()->json(['data' => $this->reportService->headcount()]);
	}

	public function byDepartment(): JsonResponse
	{
		return response()->json(['data' => $this->reportService->byDepartment()]);
	}

	public function byPayScale(): JsonResponse
	{
		return response()->json(['data' => $this->reportService->byPayScale()]);
	}

	public function assets(): JsonResponse
	{
		return response()->json(['data' => $this->reportService->assets()]);
	}

	public function incompleteDossiers(): JsonResponse
	{
		return response()->json(['data' => $this->reportService->incompleteDossiers()]);
	}

	public function staffByDepartment(Request $request): JsonResponse
	{
		return response()->json(['data' => $this->reportService->staffByDepartment($request->user())]);
	}
}
