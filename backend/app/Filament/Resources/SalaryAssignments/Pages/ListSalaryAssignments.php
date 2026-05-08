<?php

namespace App\Filament\Resources\SalaryAssignments\Pages;

use App\Filament\Resources\SalaryAssignments\SalaryAssignmentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSalaryAssignments extends ListRecords
{
    protected static string $resource = SalaryAssignmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
