<?php

namespace App\Filament\Resources\EmploymentRecords\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class EmploymentRecordForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('employee_id')
                    ->relationship('employee', 'id')
                    ->required(),
                Select::make('position_id')
                    ->relationship('position', 'title'),
                DatePicker::make('start_date')
                    ->required(),
                DatePicker::make('end_date'),
                TextInput::make('employment_type')
                    ->required()
                    ->default('permanent'),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
                Textarea::make('notes')
                    ->columnSpanFull(),
                Select::make('job_function_id')
                    ->relationship('jobFunction', 'title'),
                Select::make('directorate_id')
                    ->relationship('directorate', 'name'),
                Select::make('department_id')
                    ->relationship('department', 'name'),
            ]);
    }
}
