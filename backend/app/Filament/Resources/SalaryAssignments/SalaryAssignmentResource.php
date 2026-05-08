<?php

namespace App\Filament\Resources\SalaryAssignments;

use App\Filament\Resources\SalaryAssignments\Pages\CreateSalaryAssignment;
use App\Filament\Resources\SalaryAssignments\Pages\EditSalaryAssignment;
use App\Filament\Resources\SalaryAssignments\Pages\ListSalaryAssignments;
use App\Filament\Resources\SalaryAssignments\Schemas\SalaryAssignmentForm;
use App\Filament\Resources\SalaryAssignments\Tables\SalaryAssignmentsTable;
use App\Models\SalaryAssignment;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SalaryAssignmentResource extends Resource
{
    protected static ?string $model = SalaryAssignment::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SalaryAssignmentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SalaryAssignmentsTable::configure($table);
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
            'index' => ListSalaryAssignments::route('/'),
            'create' => CreateSalaryAssignment::route('/create'),
            'edit' => EditSalaryAssignment::route('/{record}/edit'),
        ];
    }
}
