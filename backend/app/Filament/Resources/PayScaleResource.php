<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PayScaleResource\Pages;
use App\Models\PayScale;
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

class PayScaleResource extends Resource
{
    protected static ?string $model = PayScale::class;
    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $navigationGroup = 'Salaris';
    protected static ?string $modelLabel = 'Salarisschaal';
    protected static ?string $pluralModelLabel = 'Salarisschalen';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('scale_code')->label('Schaalcode')->required()->maxLength(20),
            TextInput::make('step_number')->label('Trede')->numeric()->required()->minValue(1),
            TextInput::make('amount')->label('Bedrag')->numeric()->required()->step(0.01),
            TextInput::make('currency')->label('Valuta')->required()->default('SRD')->maxLength(10),
            Textarea::make('allowance_notes')->label('Toeslag-notities')->rows(2)->columnSpanFull(),
            Toggle::make('is_active')->label('Actief')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('scale_code')->label('Schaal')->searchable()->sortable(),
            TextColumn::make('step_number')->label('Trede')->sortable(),
            TextColumn::make('amount')->label('Bedrag')->money(fn ($record) => $record->currency)->sortable(),
            TextColumn::make('currency')->label('Valuta')->toggleable(),
            IconColumn::make('is_active')->label('Actief')->boolean(),
        ])
        ->actions([EditAction::make(), DeleteAction::make()])
        ->defaultSort('scale_code')->defaultSort('step_number');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayScales::route('/'),
            'create' => Pages\CreatePayScale::route('/create'),
            'edit' => Pages\EditPayScale::route('/{record}/edit'),
        ];
    }
}
