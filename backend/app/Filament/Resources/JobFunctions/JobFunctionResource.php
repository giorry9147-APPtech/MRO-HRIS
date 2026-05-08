<?php

namespace App\Filament\Resources\JobFunctions;

use App\Filament\Resources\JobFunctions\Pages\CreateJobFunction;
use App\Filament\Resources\JobFunctions\Pages\EditJobFunction;
use App\Filament\Resources\JobFunctions\Pages\ListJobFunctions;
use App\Filament\Resources\JobFunctions\Schemas\JobFunctionForm;
use App\Filament\Resources\JobFunctions\Tables\JobFunctionsTable;
use App\Models\JobFunction;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class JobFunctionResource extends Resource
{
    protected static ?string $model = JobFunction::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return JobFunctionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return JobFunctionsTable::configure($table);
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
            'index' => ListJobFunctions::route('/'),
            'create' => CreateJobFunction::route('/create'),
            'edit' => EditJobFunction::route('/{record}/edit'),
        ];
    }
}
