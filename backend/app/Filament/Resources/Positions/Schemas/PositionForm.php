<?php

namespace App\Filament\Resources\Positions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PositionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('department_id')
                    ->relationship('department', 'name'),
                TextInput::make('title')
                    ->required(),
                TextInput::make('code'),
                TextInput::make('grade'),
                TextInput::make('status')
                    ->required()
                    ->default('vacant'),
                Select::make('job_function_id')
                    ->relationship('jobFunction', 'title'),
            ]);
    }
}
