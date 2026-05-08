<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkExperienceResource\Pages;
use App\Models\WorkExperience;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class WorkExperienceResource extends Resource
{
    protected static ?string $model = WorkExperience::class;
    protected static ?string $navigationIcon = 'heroicon-o-clock';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Werkervaring';
    protected static ?string $pluralModelLabel = 'Werkervaring';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            TextInput::make('company_name')->label('Werkgever')->required()->maxLength(150),
            TextInput::make('job_title')->label('Functie')->required()->maxLength(150),
            DatePicker::make('start_date')->label('Van')->required()->native(false),
            DatePicker::make('end_date')->label('Tot')->native(false),
            Textarea::make('description')->label('Beschrijving')->rows(3)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('company_name')->label('Werkgever')->searchable(),
            TextColumn::make('job_title')->label('Functie')->searchable(),
            TextColumn::make('start_date')->label('Van')->date('d-m-Y')->sortable(),
            TextColumn::make('end_date')->label('Tot')->date('d-m-Y')->placeholder('Heden'),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('start_date', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorkExperiences::route('/'),
            'create' => Pages\CreateWorkExperience::route('/create'),
            'edit' => Pages\EditWorkExperience::route('/{record}/edit'),
        ];
    }
}
