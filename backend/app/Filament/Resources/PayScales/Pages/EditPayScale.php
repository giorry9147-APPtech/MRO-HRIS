<?php

namespace App\Filament\Resources\PayScales\Pages;

use App\Filament\Resources\PayScales\PayScaleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPayScale extends EditRecord
{
    protected static string $resource = PayScaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
