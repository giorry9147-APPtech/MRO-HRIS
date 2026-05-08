<?php

namespace App\Filament\Resources\Qualifications\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class QualificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('employee_id')
                    ->relationship('employee', 'id')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('institution'),
                DatePicker::make('obtained_date'),
                DatePicker::make('expiry_date'),
                TextInput::make('credential_id'),
                TextInput::make('status')
                    ->required()
                    ->default('valid'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
