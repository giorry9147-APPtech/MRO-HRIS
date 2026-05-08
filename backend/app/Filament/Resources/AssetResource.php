<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AssetResource\Pages;
use App\Models\Asset;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AssetResource extends Resource
{
    protected static ?string $model = Asset::class;
    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Personeel';
    protected static ?string $modelLabel = 'Bedrijfsmiddel';
    protected static ?string $pluralModelLabel = 'Bedrijfsmiddelen';
    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('asset_tag')->label('Asset-tag')->required()->unique(ignoreRecord: true)->maxLength(50),
            TextInput::make('name')->label('Naam')->required()->maxLength(150),
            TextInput::make('category')->label('Categorie')->maxLength(80),
            TextInput::make('serial_number')->label('Serienummer')->maxLength(100),
            Select::make('status')->label('Status')->required()->options([
                'available' => 'Beschikbaar',
                'assigned' => 'Toegewezen',
                'maintenance' => 'In onderhoud',
                'retired' => 'Afgevoerd',
            ])->default('available'),
            Textarea::make('notes')->label('Notities')->rows(2)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('asset_tag')->label('Tag')->searchable()->sortable(),
            TextColumn::make('name')->label('Naam')->searchable()->sortable(),
            TextColumn::make('category')->label('Categorie')->toggleable(),
            TextColumn::make('serial_number')->label('Serienr.')->toggleable(),
            TextColumn::make('status')->label('Status')->badge(),
        ])
        ->filters([
            SelectFilter::make('status')->options([
                'available' => 'Beschikbaar', 'assigned' => 'Toegewezen',
                'maintenance' => 'In onderhoud', 'retired' => 'Afgevoerd',
            ]),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAssets::route('/'),
            'create' => Pages\CreateAsset::route('/create'),
            'edit' => Pages\EditAsset::route('/{record}/edit'),
        ];
    }
}
