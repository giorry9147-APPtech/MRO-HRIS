<?php
namespace App\Filament\Resources\AssetAssignmentResource\Pages;
use App\Filament\Resources\AssetAssignmentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
class ListAssetAssignments extends ListRecords {
    protected static string $resource = AssetAssignmentResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
