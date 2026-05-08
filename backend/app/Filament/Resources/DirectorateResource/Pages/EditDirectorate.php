<?php

namespace App\Filament\Resources\DirectorateResource\Pages;

use App\Filament\Resources\DirectorateResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDirectorate extends EditRecord
{
    protected static string $resource = DirectorateResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}
