<?php

namespace App\Services;

use App\Models\EmployeeDocument;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\BinaryFileResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
	public function list(array $filters = []): LengthAwarePaginator
	{
		$query = EmployeeDocument::query()->with('employee')->latest();

		if (!empty($filters['employee_id'])) {
			$query->where('employee_id', $filters['employee_id']);
		}

		if (!empty($filters['q'])) {
			$search = $filters['q'];
			$query->where(function ($innerQuery) use ($search) {
				$innerQuery
					->where('title', 'like', "%{$search}%")
					->orWhere('document_type', 'like', "%{$search}%")
					->orWhere('original_name', 'like', "%{$search}%");
			});
		}

		$perPage = (int) ($filters['per_page'] ?? 15);

		return $query->paginate($perPage > 0 ? $perPage : 15);
	}

	public function create(array $data): EmployeeDocument
	{
		/** @var UploadedFile $file */
		$file = $data['file'];
		$filePath = $file->store('documents', 'local');

		unset($data['file']);

		return EmployeeDocument::create([
			...$data,
			'original_name' => $file->getClientOriginalName(),
			'file_path' => $filePath,
			'mime_type' => $file->getClientMimeType(),
			'file_size' => $file->getSize(),
			'uploaded_at' => now(),
		])->load('employee');
	}

	public function delete(EmployeeDocument $document): void
	{
		if ($document->file_path && Storage::disk('local')->exists($document->file_path)) {
			Storage::disk('local')->delete($document->file_path);
		}

		$document->delete();
	}

	public function download(EmployeeDocument $document): BinaryFileResponse
	{
		if (!$document->file_path || !Storage::disk('local')->exists($document->file_path)) {
			abort(404, 'Document file not found.');
		}

		return Storage::disk('local')->download(
			$document->file_path,
			$document->original_name ?? basename($document->file_path),
			[
				'Content-Type' => $document->mime_type ?? 'application/octet-stream',
			]
		);
	}
}
