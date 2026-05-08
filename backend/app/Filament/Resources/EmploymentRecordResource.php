<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmploymentRecordResource\Pages;
use App\Models\EmploymentRecord;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class EmploymentRecordResource extends Resource
{
    protected static ?string $model = EmploymentRecord::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Dienstverband';
    protected static ?string $pluralModelLabel = 'Dienstverbanden';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name} ({$record->employee_number})")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            Select::make('directorate_id')->label('Directoraat')->relationship('directorate', 'name')->searchable()->preload(),
            Select::make('department_id')->label('Afdeling')->relationship('department', 'name')->searchable()->preload(),
            Select::make('position_id')->label('Functieplaats')->relationship('position', 'title')->searchable()->preload(),
            Select::make('job_function_id')->label('Functie')->relationship('jobFunction', 'title')->searchable()->preload(),
            DatePicker::make('start_date')->label('Startdatum')->required()->native(false),
            DatePicker::make('end_date')->label('Einddatum')->native(false),
            Select::make('employment_type')->label('Dienstverbandvorm')->options([
                'permanent' => 'Vast', 'temporary' => 'Tijdelijk', 'contract' => 'Contract', 'intern' => 'Stage',
            ]),
            Select::make('status')->label('Status')->required()->options([
                'active' => 'Actief', 'ended' => 'Beëindigd', 'transferred' => 'Overgeplaatst',
            ])->default('active'),
            Textarea::make('notes')->label('Notities')->rows(2)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('position.title')->label('Functieplaats')->searchable()->toggleable(),
            TextColumn::make('department.name')->label('Afdeling')->toggleable(),
            TextColumn::make('start_date')->label('Start')->date('d-m-Y')->sortable(),
            TextColumn::make('end_date')->label('Eind')->date('d-m-Y')->placeholder('—')->toggleable(),
            TextColumn::make('status')->label('Status')->badge(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('start_date', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmploymentRecords::route('/'),
            'create' => Pages\CreateEmploymentRecord::route('/create'),
            'edit' => Pages\EditEmploymentRecord::route('/{record}/edit'),
        ];
    }
}
