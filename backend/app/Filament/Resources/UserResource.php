<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-key';

    protected static ?string $navigationGroup = 'Systeem';

    protected static ?string $modelLabel = 'Gebruiker';

    protected static ?string $pluralModelLabel = 'Gebruikers';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')->label('Naam')->required()->maxLength(150),
            TextInput::make('email')->label('E-mail')->email()->required()->unique(ignoreRecord: true)->maxLength(150),

            TextInput::make('password')
                ->label('Wachtwoord')
                ->password()
                ->revealable()
                ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                ->dehydrated(fn ($state) => filled($state))
                ->required(fn (string $context): bool => $context === 'create')
                ->helperText('Bij bewerken — laat leeg om wachtwoord ongewijzigd te laten.'),

            Select::make('roles')
                ->label('Rollen')
                ->relationship('roles', 'name')
                ->multiple()
                ->preload()
                ->options(Role::pluck('name', 'name')->toArray())
                ->saveRelationshipsUsing(function (User $record, $state) {
                    $record->syncRoles($state);
                })
                ->columnSpanFull(),

            Select::make('scope_type')
                ->label('Toegangsbereik')
                ->options([
                    'all' => 'Alles',
                    'directorates' => 'Beperkt tot directoraten',
                    'departments' => 'Beperkt tot afdelingen',
                ])
                ->default('all')
                ->live(),

            Select::make('allowed_directorate_ids')
                ->label('Toegestane directoraten')
                ->options(fn () => \App\Models\Directorate::pluck('name', 'id'))
                ->multiple()
                ->preload()
                ->visible(fn ($get) => $get('scope_type') === 'directorates'),

            Select::make('allowed_department_ids')
                ->label('Toegestane afdelingen')
                ->options(fn () => \App\Models\Department::pluck('name', 'id'))
                ->multiple()
                ->preload()
                ->visible(fn ($get) => $get('scope_type') === 'departments'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Naam')->searchable()->sortable(),
                TextColumn::make('email')->label('E-mail')->searchable(),
                TextColumn::make('roles.name')->label('Rollen')->badge(),
                TextColumn::make('scope_type')->label('Bereik')->toggleable(),
                TextColumn::make('created_at')->label('Aangemaakt')->date('d-m-Y')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
