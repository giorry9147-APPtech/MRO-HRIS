<?php

namespace App\Filament\Resources\PayScales\Pages;

use App\Filament\Resources\PayScales\PayScaleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPayScales extends ListRecords
{
    protected static string $resource = PayScaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
