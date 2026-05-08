<?php
namespace App\Filament\Resources\WorkExperienceResource\Pages;
use App\Filament\Resources\WorkExperienceResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
class EditWorkExperience extends EditRecord {
    protected static string $resource = WorkExperienceResource::class;
    protected function getHeaderActions(): array { return [DeleteAction::make()]; }
}
