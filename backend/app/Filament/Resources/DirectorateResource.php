<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DirectorateResource\Pages;
use App\Models\Directorate;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DirectorateResource extends Resource
{
    protected static ?string $model = Directorate::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    protected static ?string $navigationGroup = 'Organisatie';

    protected static ?string $modelLabel = 'Directoraat';

    protected static ?string $pluralModelLabel = 'Directoraten';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')->label('Naam')->required()->maxLength(150),
            TextInput::make('code')->label('Code')->required()->maxLength(50),
            Textarea::make('description')->label('Omschrijving')->rows(2)->columnSpanFull(),
            Select::make('status')->label('Status')->required()->options([
                'active' => 'Actief',
                'inactive' => 'Inactief',
            ])->default('active'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->label('Code')->searchable()->sortable(),
                TextColumn::make('name')->label('Naam')->searchable()->sortable(),
                TextColumn::make('departments_count')->label('Afdelingen')->counts('departments')->sortable(),
                TextColumn::make('status')->label('Status')->badge(),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDirectorates::route('/'),
            'create' => Pages\CreateDirectorate::route('/create'),
            'edit' => Pages\EditDirectorate::route('/{record}/edit'),
        ];
    }
}
