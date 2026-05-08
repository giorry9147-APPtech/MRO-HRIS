<?php

namespace App\Filament\Resources\PayScales;

use App\Filament\Resources\PayScales\Pages\CreatePayScale;
use App\Filament\Resources\PayScales\Pages\EditPayScale;
use App\Filament\Resources\PayScales\Pages\ListPayScales;
use App\Filament\Resources\PayScales\Schemas\PayScaleForm;
use App\Filament\Resources\PayScales\Tables\PayScalesTable;
use App\Models\PayScale;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PayScaleResource extends Resource
{
    protected static ?string $model = PayScale::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PayScaleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PayScalesTable::configure($table);
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
            'index' => ListPayScales::route('/'),
            'create' => CreatePayScale::route('/create'),
            'edit' => EditPayScale::route('/{record}/edit'),
        ];
    }
}
