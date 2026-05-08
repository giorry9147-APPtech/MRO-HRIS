<?php

namespace App\Filament\Resources\Departments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DepartmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('directorate_id')
                    ->relationship('directorate', 'name'),
                TextInput::make('name')
                    ->required(),
                TextInput::make('code'),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
                Select::make('parent_department_id')
                    ->relationship('parentDepartment', 'name'),
            ]);
    }
}
