<?php

namespace App\Filament\Resources\Assets\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AssetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('asset_tag')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('category'),
                TextInput::make('serial_number'),
                TextInput::make('status')
                    ->required()
                    ->default('available'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
