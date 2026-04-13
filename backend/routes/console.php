<?php

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\EmploymentRecord;
use App\Models\Position;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:e2e-employee-dossier {--cleanup : Remove created employee data after the check}', function () {
    $timings = [];
    $mark = static function () {
        return microtime(true);
    };

    $employee = null;
    $document = null;
    $employment = null;
    $assignment = null;
    $createdAsset = false;

    $start = $mark();
    $position = Position::query()->first();
    $timings['position_lookup_ms'] = (int) round(($mark() - $start) * 1000);

    if (!$position) {
        $this->error('Geen werkpositie gevonden. Maak eerst minimaal 1 werkpositie aan.');
        return self::FAILURE;
    }

    $employeeNumber = 'E2E-' . now()->format('YmdHis');
    $photoPath = 'employee-photos/' . $employeeNumber . '.jpg';
    $documentPath = 'documents/' . $employeeNumber . '-contract.txt';

    $start = $mark();
    Storage::disk('public')->put($photoPath, 'fake-jpeg-content-for-e2e-check');
    $timings['photo_upload_ms'] = (int) round(($mark() - $start) * 1000);

    $start = $mark();
    $employee = Employee::create([
        'employee_number' => $employeeNumber,
        'first_name' => 'E2E',
        'last_name' => 'Controle',
        'email' => strtolower($employeeNumber) . '@example.local',
        'phone' => '+597-000000',
        'address' => 'Teststraat 1',
        'profile_photo_path' => $photoPath,
        'date_joined' => now()->toDateString(),
        'status' => 'active',
    ]);
    $timings['employee_create_ms'] = (int) round(($mark() - $start) * 1000);

    $start = $mark();
    $employmentPayload = [
        'employee_id' => $employee->id,
        'position_id' => $position->id,
        'start_date' => now()->toDateString(),
        'employment_type' => 'permanent',
        'status' => 'active',
    ];
    if (Schema::hasColumn('employment_records', 'job_function_id')) {
        $employmentPayload['job_function_id'] = $position->job_function_id;
    }
    $employment = EmploymentRecord::create($employmentPayload);
    $timings['employment_create_ms'] = (int) round(($mark() - $start) * 1000);

    $start = $mark();
    Storage::disk('local')->put($documentPath, "Arbeidscontract testdossier voor {$employeeNumber}");
    $document = EmployeeDocument::create([
        'employee_id' => $employee->id,
        'title' => 'Arbeidscontract (test)',
        'document_type' => 'contract',
        'original_name' => $employeeNumber . '-contract.txt',
        'file_path' => $documentPath,
        'mime_type' => 'text/plain',
        'file_size' => Storage::disk('local')->size($documentPath),
        'uploaded_at' => now(),
    ]);
    $timings['document_upload_ms'] = (int) round(($mark() - $start) * 1000);

    $start = $mark();
    $asset = Asset::query()->where('status', 'available')->first();
    if (!$asset) {
        $asset = Asset::create([
            'asset_tag' => $employeeNumber . '-LAP',
            'name' => 'Laptop testdossier',
            'category' => 'ICT',
            'status' => 'available',
        ]);
        $createdAsset = true;
    }

    $assignment = AssetAssignment::create([
        'employee_id' => $employee->id,
        'asset_id' => $asset->id,
        'assigned_at' => now(),
        'status' => 'assigned',
    ]);
    $asset->update(['status' => 'assigned']);
    $timings['asset_assign_ms'] = (int) round(($mark() - $start) * 1000);

    $start = $mark();
    $directoratesCount = \App\Models\Directorate::query()->count();
    $departmentsCount = \App\Models\Department::query()->count();
    $positionsCount = Position::query()->count();
    $jobFunctionsCount = \App\Models\JobFunction::query()->count();
    $timings['option_counts_ms'] = (int) round(($mark() - $start) * 1000);

    $this->info('E2E personeelsdossier aangemaakt.');
    $this->line('Medewerker ID: ' . $employee->id . ' (' . $employeeNumber . ')');
    $this->line('Employment ID: ' . $employment->id . ' / Position ID: ' . $position->id);
    $this->line('Document ID: ' . $document->id . ' / Asset assignment ID: ' . $assignment->id);
    $this->newLine();
    $this->line('Timings (ms):');
    foreach ($timings as $key => $value) {
        $this->line(' - ' . $key . ': ' . $value);
    }
    $this->newLine();
    $this->line('Dataset grootte:');
    $this->line(' - directoraten: ' . $directoratesCount);
    $this->line(' - afdelingen: ' . $departmentsCount);
    $this->line(' - werkposities: ' . $positionsCount);
    $this->line(' - functies: ' . $jobFunctionsCount);

    if ($this->option('cleanup')) {
        $assignment?->delete();
        if ($createdAsset) {
            $asset?->delete();
        } else {
            $asset?->update(['status' => 'available']);
        }
        $employment?->delete();
        $document?->delete();
        $employee?->delete();
        Storage::disk('public')->delete($photoPath);
        Storage::disk('local')->delete($documentPath);
        $this->comment('Cleanup uitgevoerd.');
    }

    return self::SUCCESS;
})->purpose('Create a full employee dossier and report end-to-end timing bottlenecks');
