<?php

namespace App\Filament\Resources\EmploymentRecords\Pages;

use App\Filament\Resources\EmploymentRecords\EmploymentRecordResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEmploymentRecords extends ListRecords
{
    protected static string $resource = EmploymentRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
