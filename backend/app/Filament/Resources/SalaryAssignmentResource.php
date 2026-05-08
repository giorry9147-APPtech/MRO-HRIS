<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SalaryAssignmentResource\Pages;
use App\Models\SalaryAssignment;
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

class SalaryAssignmentResource extends Resource
{
    protected static ?string $model = SalaryAssignment::class;
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationGroup = 'Salaris';
    protected static ?string $modelLabel = 'Salaristoewijzing';
    protected static ?string $pluralModelLabel = 'Salaristoewijzingen';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            Select::make('pay_scale_id')->label('Salarisschaal')
                ->relationship('payScale', 'scale_code')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->scale_code} – Trede {$record->step_number}")
                ->searchable()->preload(),
            TextInput::make('amount')->label('Bedrag')->numeric()->required()->step(0.01),
            TextInput::make('currency')->label('Valuta')->required()->default('SRD')->maxLength(10),
            DatePicker::make('start_date')->label('Startdatum')->required()->native(false),
            DatePicker::make('end_date')->label('Einddatum')->native(false),
            Select::make('status')->label('Status')->required()->options([
                'active' => 'Actief', 'ended' => 'Beëindigd',
            ])->default('active'),
            Textarea::make('notes')->label('Notities')->rows(2)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('payScale.scale_code')->label('Schaal')->placeholder('—')->toggleable(),
            TextColumn::make('amount')->label('Bedrag')->money(fn ($record) => $record->currency)->sortable(),
            TextColumn::make('start_date')->label('Vanaf')->date('d-m-Y')->sortable(),
            TextColumn::make('end_date')->label('Tot')->date('d-m-Y')->placeholder('—')->toggleable(),
            TextColumn::make('status')->label('Status')->badge(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('start_date', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSalaryAssignments::route('/'),
            'create' => Pages\CreateSalaryAssignment::route('/create'),
            'edit' => Pages\EditSalaryAssignment::route('/{record}/edit'),
        ];
    }
}
