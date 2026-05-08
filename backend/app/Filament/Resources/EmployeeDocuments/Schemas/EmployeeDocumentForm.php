<?php

namespace App\Filament\Resources\EmployeeDocuments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EmployeeDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('employee_id')
                    ->relationship('employee', 'id'),
                TextInput::make('title')
                    ->required(),
                TextInput::make('document_type')
                    ->required(),
                TextInput::make('original_name')
                    ->required(),
                TextInput::make('file_path')
                    ->required(),
                TextInput::make('mime_type'),
                TextInput::make('file_size')
                    ->numeric(),
                DateTimePicker::make('uploaded_at'),
            ]);
    }
}
