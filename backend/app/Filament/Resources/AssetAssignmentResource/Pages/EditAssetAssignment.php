<?php
namespace App\Filament\Resources\AssetAssignmentResource\Pages;
use App\Filament\Resources\AssetAssignmentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
class EditAssetAssignment extends EditRecord {
    protected static string $resource = AssetAssignmentResource::class;
    protected function getHeaderActions(): array { return [DeleteAction::make()]; }
}
