<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DepartmentResource\Pages;
use App\Models\Department;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class DepartmentResource extends Resource
{
    protected static ?string $model = Department::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Organisatie';

    protected static ?string $modelLabel = 'Afdeling';

    protected static ?string $pluralModelLabel = 'Afdelingen';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('directorate_id')
                ->label('Directoraat')
                ->relationship('directorate', 'name')
                ->required()
                ->searchable()
                ->preload(),

            Select::make('parent_department_id')
                ->label('Bovenliggende afdeling')
                ->relationship(
                    'parentDepartment',
                    'name',
                    fn ($query, $get) => $query->where('directorate_id', $get('directorate_id'))
                )
                ->searchable()
                ->preload()
                ->placeholder('Geen — top-level afdeling'),

            TextInput::make('name')->label('Naam')->required()->maxLength(150),
            TextInput::make('code')->label('Code')->required()->maxLength(50),

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
                TextColumn::make('directorate.name')->label('Directoraat')->sortable()->searchable(),
                TextColumn::make('parentDepartment.name')->label('Onder')->placeholder('—')->toggleable(),
                TextColumn::make('status')->label('Status')->badge(),
            ])
            ->filters([
                SelectFilter::make('directorate_id')
                    ->label('Directoraat')
                    ->relationship('directorate', 'name'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDepartments::route('/'),
            'create' => Pages\CreateDepartment::route('/create'),
            'edit' => Pages\EditDepartment::route('/{record}/edit'),
        ];
    }
}
