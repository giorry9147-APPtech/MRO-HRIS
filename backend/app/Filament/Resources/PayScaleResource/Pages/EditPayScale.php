<?php
namespace App\Filament\Resources\PayScaleResource\Pages;
use App\Filament\Resources\PayScaleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
class EditPayScale extends EditRecord {
    protected static string $resource = PayScaleResource::class;
    protected function getHeaderActions(): array { return [DeleteAction::make()]; }
}
