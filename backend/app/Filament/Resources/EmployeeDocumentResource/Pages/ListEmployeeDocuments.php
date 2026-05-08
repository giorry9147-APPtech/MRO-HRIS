<?php
namespace App\Filament\Resources\EmployeeDocumentResource\Pages;
use App\Filament\Resources\EmployeeDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
class ListEmployeeDocuments extends ListRecords {
    protected static string $resource = EmployeeDocumentResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
