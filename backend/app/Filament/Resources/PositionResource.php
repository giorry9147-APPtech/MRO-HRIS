<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PositionResource\Pages;
use App\Models\Position;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PositionResource extends Resource
{
    protected static ?string $model = Position::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationGroup = 'Organisatie';

    protected static ?string $modelLabel = 'Functieplaats';

    protected static ?string $pluralModelLabel = 'Functieplaatsen';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('department_id')->label('Afdeling')->relationship('department', 'name')->required()->searchable()->preload(),
            Select::make('job_function_id')->label('Functie')->relationship('jobFunction', 'title')->searchable()->preload(),
            TextInput::make('title')->label('Titel')->required()->maxLength(150),
            TextInput::make('code')->label('Code')->maxLength(50),
            TextInput::make('grade')->label('Schaal/grade')->maxLength(50),
            Select::make('status')->label('Status')->required()->options([
                'active' => 'Actief',
                'inactive' => 'Inactief',
                'vacant' => 'Vacant',
            ])->default('active'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->label('Code')->searchable()->toggleable(),
                TextColumn::make('title')->label('Titel')->searchable()->sortable(),
                TextColumn::make('department.name')->label('Afdeling')->sortable(),
                TextColumn::make('jobFunction.title')->label('Functie')->toggleable(),
                TextColumn::make('grade')->label('Grade')->toggleable(),
                TextColumn::make('status')->label('Status')->badge(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'active' => 'Actief', 'inactive' => 'Inactief', 'vacant' => 'Vacant',
                ]),
                SelectFilter::make('department_id')->label('Afdeling')->relationship('department', 'name'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->defaultSort('title');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPositions::route('/'),
            'create' => Pages\CreatePosition::route('/create'),
            'edit' => Pages\EditPosition::route('/{record}/edit'),
        ];
    }
}
