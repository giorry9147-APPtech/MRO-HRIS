<?php

namespace App\Filament\Resources\EmploymentRecords\Pages;

use App\Filament\Resources\EmploymentRecords\EmploymentRecordResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEmploymentRecord extends EditRecord
{
    protected static string $resource = EmploymentRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
