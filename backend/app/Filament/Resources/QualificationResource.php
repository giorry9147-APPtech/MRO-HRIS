<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QualificationResource\Pages;
use App\Models\Qualification;
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

class QualificationResource extends Resource
{
    protected static ?string $model = Qualification::class;
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Kwalificatie';
    protected static ?string $pluralModelLabel = 'Kwalificaties';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            TextInput::make('name')->label('Diploma/certificaat')->required()->maxLength(150),
            TextInput::make('institution')->label('Instituut')->maxLength(150),
            DatePicker::make('obtained_date')->label('Behaald op')->native(false),
            DatePicker::make('expiry_date')->label('Geldig tot')->native(false),
            TextInput::make('credential_id')->label('Diploma-/certificaatnummer')->maxLength(100),
            Select::make('status')->label('Status')->options([
                'valid' => 'Geldig', 'expired' => 'Verlopen', 'pending' => 'In behandeling',
            ])->default('valid'),
            Textarea::make('notes')->label('Notities')->rows(2)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('name')->label('Naam')->searchable(),
            TextColumn::make('institution')->label('Instituut')->toggleable(),
            TextColumn::make('obtained_date')->label('Behaald')->date('d-m-Y')->sortable(),
            TextColumn::make('expiry_date')->label('Verloopt')->date('d-m-Y')->placeholder('—'),
            TextColumn::make('status')->label('Status')->badge(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('obtained_date', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListQualifications::route('/'),
            'create' => Pages\CreateQualification::route('/create'),
            'edit' => Pages\EditQualification::route('/{record}/edit'),
        ];
    }
}
