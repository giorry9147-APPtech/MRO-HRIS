<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AssetAssignmentResource\Pages;
use App\Models\AssetAssignment;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AssetAssignmentResource extends Resource
{
    protected static ?string $model = AssetAssignment::class;
    protected static ?string $navigationIcon = 'heroicon-o-arrow-right-circle';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Asset-toewijzing';
    protected static ?string $pluralModelLabel = 'Asset-toewijzingen';
    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('employee_id')->label('Medewerker')
                ->relationship('employee', 'last_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name} ({$record->employee_number})")
                ->searchable(['first_name', 'last_name', 'employee_number'])->preload()->required(),
            Select::make('asset_id')->label('Bedrijfsmiddel')
                ->relationship('asset', 'name')
                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->asset_tag} — {$record->name}")
                ->searchable(['asset_tag', 'name'])->preload()->required(),
            DateTimePicker::make('assigned_at')->label('Toegewezen op')->required()->native(false),
            DateTimePicker::make('returned_at')->label('Geretourneerd op')->native(false),
            Select::make('status')->label('Status')->required()->options([
                'active' => 'Actief', 'returned' => 'Geretourneerd', 'lost' => 'Verloren',
            ])->default('active'),
            Textarea::make('notes')->label('Notities')->rows(2)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('employee.last_name')->label('Medewerker')->formatStateUsing(fn ($record) => "{$record->employee->first_name} {$record->employee->last_name}")->searchable(),
            TextColumn::make('asset.name')->label('Asset')->searchable(),
            TextColumn::make('asset.asset_tag')->label('Tag')->toggleable(),
            TextColumn::make('assigned_at')->label('Toegewezen')->dateTime('d-m-Y')->sortable(),
            TextColumn::make('returned_at')->label('Retour')->dateTime('d-m-Y')->placeholder('—')->toggleable(),
            TextColumn::make('status')->label('Status')->badge(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('assigned_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAssetAssignments::route('/'),
            'create' => Pages\CreateAssetAssignment::route('/create'),
            'edit' => Pages\EditAssetAssignment::route('/{record}/edit'),
        ];
    }
}
