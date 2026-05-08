<?php
namespace App\Filament\Resources\SalaryAssignmentResource\Pages;
use App\Filament\Resources\SalaryAssignmentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
class ListSalaryAssignments extends ListRecords {
    protected static string $resource = SalaryAssignmentResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
