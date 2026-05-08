<?php

namespace App\Filament\Resources\Directorates;

use App\Filament\Resources\Directorates\Pages\CreateDirectorate;
use App\Filament\Resources\Directorates\Pages\EditDirectorate;
use App\Filament\Resources\Directorates\Pages\ListDirectorates;
use App\Filament\Resources\Directorates\Schemas\DirectorateForm;
use App\Filament\Resources\Directorates\Tables\DirectoratesTable;
use App\Models\Directorate;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DirectorateResource extends Resource
{
    protected static ?string $model = Directorate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return DirectorateForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DirectoratesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDirectorates::route('/'),
            'create' => CreateDirectorate::route('/create'),
            'edit' => EditDirectorate::route('/{record}/edit'),
        ];
    }
}
