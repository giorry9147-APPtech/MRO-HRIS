<?php

namespace App\Filament\Resources\AssetAssignments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AssetAssignmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('employee_id')
                    ->relationship('employee', 'id')
                    ->required(),
                Select::make('asset_id')
                    ->relationship('asset', 'name')
                    ->required(),
                DateTimePicker::make('assigned_at')
                    ->required(),
                DateTimePicker::make('returned_at'),
                TextInput::make('status')
                    ->required()
                    ->default('assigned'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
