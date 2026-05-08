<?php
namespace App\Filament\Resources\EmploymentRecordResource\Pages;
use App\Filament\Resources\EmploymentRecordResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
class ListEmploymentRecords extends ListRecords {
    protected static string $resource = EmploymentRecordResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
