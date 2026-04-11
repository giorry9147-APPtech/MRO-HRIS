<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\EmployeeDocument;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
	public function __construct(private readonly DocumentService $documentService)
	{
	}

	public function index(Request $request)
	{
		$documents = $this->documentService->list($request->only(['employee_id', 'q', 'per_page']));

		return DocumentResource::collection($documents);
	}

	public function store(StoreDocumentRequest $request): DocumentResource
	{
		$document = $this->documentService->create($request->validated());

		return new DocumentResource($document);
	}

	public function show(EmployeeDocument $document): DocumentResource
	{
		$document->load('employee');

		return new DocumentResource($document);
	}

	public function destroy(EmployeeDocument $document): JsonResponse
	{
		$this->documentService->delete($document);

		return response()->json(['message' => 'Document deleted.']);
	}

	public function download(EmployeeDocument $document)
	{
		return $this->documentService->download($document);
	}
}
