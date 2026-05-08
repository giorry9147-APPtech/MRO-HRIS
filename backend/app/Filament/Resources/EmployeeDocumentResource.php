<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmployeeDocumentResource\Pages;
use App\Models\EmployeeDocument;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EmployeeDocumentResource extends Resource
{
    protected static ?string $model = EmployeeDocument::class;
    protected static ?string $navigationIcon = 'heroicon-o-document';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Document';
    protected static ?string $pluralModelLabel = 'Documenten';
    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            TextInput::make('title')->label('Titel')->required()->maxLength(150),
            Select::make('document_type')->label('Type')->required()->options([
                'id_copy' => 'ID-kopie',
                'diploma' => 'Diploma',
                'contract' => 'Contract',
                'medical' => 'Medisch',
                'tax' => 'Belastingen',
                'other' => 'Overig',
            ]),
            FileUpload::make('file_path')->label('Bestand')->required()
                ->disk('public')->directory('employee-documents')
                ->maxSize(10240)
                ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                ->columnSpanFull(),
            DateTimePicker::make('uploaded_at')->label('Geüpload op')->default(now())->native(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('title')->label('Titel')->searchable(),
            TextColumn::make('document_type')->label('Type')->badge(),
            TextColumn::make('uploaded_at')->label('Geüpload')->dateTime('d-m-Y')->sortable(),
        ])
        ->filters([
            SelectFilter::make('document_type')->options([
                'id_copy' => 'ID-kopie', 'diploma' => 'Diploma', 'contract' => 'Contract',
                'medical' => 'Medisch', 'tax' => 'Belastingen', 'other' => 'Overig',
            ]),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('uploaded_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmployeeDocuments::route('/'),
            'create' => Pages\CreateEmployeeDocument::route('/create'),
            'edit' => Pages\EditEmployeeDocument::route('/{record}/edit'),
        ];
    }
}
