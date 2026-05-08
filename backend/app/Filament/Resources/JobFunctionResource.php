<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobFunctionResource\Pages;
use App\Models\JobFunction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class JobFunctionResource extends Resource
{
    protected static ?string $model = JobFunction::class;
    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = 'Organisatie';
    protected static ?string $modelLabel = 'Functie';
    protected static ?string $pluralModelLabel = 'Functies';
    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('code')->label('Code')->required()->maxLength(50),
            TextInput::make('title')->label('Titel')->required()->maxLength(150),
            Textarea::make('description')->label('Omschrijving')->rows(3)->columnSpanFull(),
            Toggle::make('is_active')->label('Actief')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('code')->label('Code')->searchable()->sortable(),
            TextColumn::make('title')->label('Titel')->searchable()->sortable(),
            TextColumn::make('positions_count')->label('Plaatsen')->counts('positions'),
            IconColumn::make('is_active')->label('Actief')->boolean(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('title');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobFunctions::route('/'),
            'create' => Pages\CreateJobFunction::route('/create'),
            'edit' => Pages\EditJobFunction::route('/{record}/edit'),
        ];
    }
}
