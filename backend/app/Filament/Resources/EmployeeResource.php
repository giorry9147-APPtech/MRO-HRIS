<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmployeeResource\Pages;
use App\Models\Employee;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EmployeeResource extends Resource
{
    protected static ?string $model = Employee::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Personeel';

    protected static ?string $modelLabel = 'Medewerker';

    protected static ?string $pluralModelLabel = 'Medewerkers';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            FileUpload::make('profile_photo_path')
                ->label('Profielfoto')
                ->image()
                ->avatar()
                ->disk('public')
                ->directory('employees')
                ->columnSpanFull(),

            TextInput::make('employee_number')
                ->label('Personeelsnummer')
                ->required()
                ->unique(ignoreRecord: true)
                ->maxLength(50),

            Select::make('status')
                ->label('Status')
                ->required()
                ->options([
                    'active' => 'Actief',
                    'inactive' => 'Inactief',
                    'on_leave' => 'Met verlof',
                    'suspended' => 'Geschorst',
                    'exited' => 'Uit dienst',
                ])
                ->default('active'),

            TextInput::make('first_name')
                ->label('Voornaam')
                ->required()
                ->maxLength(100),

            TextInput::make('last_name')
                ->label('Achternaam')
                ->required()
                ->maxLength(100),

            TextInput::make('email')
                ->label('E-mailadres')
                ->email()
                ->maxLength(150),

            TextInput::make('phone')
                ->label('Telefoon')
                ->tel()
                ->maxLength(50),

            DatePicker::make('date_joined')
                ->label('Datum in dienst')
                ->native(false),

            Textarea::make('address')
                ->label('Adres')
                ->rows(2)
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('profile_photo_path')
                    ->label('')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(url('/images/avatar-placeholder.png')),

                TextColumn::make('employee_number')
                    ->label('Nr.')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('full_name')
                    ->label('Naam')
                    ->state(fn (Employee $record): string => trim($record->first_name . ' ' . $record->last_name))
                    ->searchable(query: fn ($query, string $search) => $query
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")),

                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->toggleable(),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'success' => 'active',
                        'warning' => 'on_leave',
                        'danger' => 'suspended',
                        'gray' => fn ($state) => in_array($state, ['inactive', 'exited']),
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => 'Actief',
                        'inactive' => 'Inactief',
                        'on_leave' => 'Met verlof',
                        'suspended' => 'Geschorst',
                        'exited' => 'Uit dienst',
                        default => $state,
                    }),

                TextColumn::make('date_joined')
                    ->label('In dienst sinds')
                    ->date('d-m-Y')
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'active' => 'Actief',
                    'inactive' => 'Inactief',
                    'on_leave' => 'Met verlof',
                    'suspended' => 'Geschorst',
                    'exited' => 'Uit dienst',
                ]),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('last_name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmployees::route('/'),
            'create' => Pages\CreateEmployee::route('/create'),
            'edit' => Pages\EditEmployee::route('/{record}/edit'),
        ];
    }
}
