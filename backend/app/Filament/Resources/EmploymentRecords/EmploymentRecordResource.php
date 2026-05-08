<?php

namespace App\Filament\Resources\EmploymentRecords;

use App\Filament\Resources\EmploymentRecords\Pages\CreateEmploymentRecord;
use App\Filament\Resources\EmploymentRecords\Pages\EditEmploymentRecord;
use App\Filament\Resources\EmploymentRecords\Pages\ListEmploymentRecords;
use App\Filament\Resources\EmploymentRecords\Schemas\EmploymentRecordForm;
use App\Filament\Resources\EmploymentRecords\Tables\EmploymentRecordsTable;
use App\Models\EmploymentRecord;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EmploymentRecordResource extends Resource
{
    protected static ?string $model = EmploymentRecord::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return EmploymentRecordForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmploymentRecordsTable::configure($table);
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
            'index' => ListEmploymentRecords::route('/'),
            'create' => CreateEmploymentRecord::route('/create'),
            'edit' => EditEmploymentRecord::route('/{record}/edit'),
        ];
    }
}
