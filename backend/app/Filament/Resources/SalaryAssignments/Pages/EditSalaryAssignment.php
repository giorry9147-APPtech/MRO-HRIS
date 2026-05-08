<?php

namespace App\Filament\Resources\SalaryAssignments\Pages;

use App\Filament\Resources\SalaryAssignments\SalaryAssignmentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSalaryAssignment extends EditRecord
{
    protected static string $resource = SalaryAssignmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
