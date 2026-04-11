<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetAssignmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DirectorateController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmploymentController;
use App\Http\Controllers\JobFunctionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PayScaleController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\UserScopeController;
use App\Http\Controllers\WorkExperienceController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
	Route::get('auth/me', [AuthController::class, 'me']);
	Route::post('auth/logout', [AuthController::class, 'logout']);
	Route::get('users', [UserScopeController::class, 'index'])->middleware('permission:users.scope.update');
	Route::patch('users/{user}/scope', [UserScopeController::class, 'update'])->middleware('permission:users.scope.update');

	Route::get('employees', [EmployeeController::class, 'index'])->middleware('permission:employees.view');
	Route::post('employees', [EmployeeController::class, 'store'])->middleware('permission:employees.create');
	Route::get('employees/{employee}', [EmployeeController::class, 'show'])->middleware('permission:employees.view');
	Route::match(['PUT', 'PATCH'], 'employees/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employees.update');
	Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employees.delete');

	Route::get('directorates', [DirectorateController::class, 'index'])->middleware('permission:directorates.view');
	Route::post('directorates', [DirectorateController::class, 'store'])->middleware('permission:directorates.create');
	Route::get('directorates/{directorate}', [DirectorateController::class, 'show'])->middleware('permission:directorates.view');
	Route::match(['PUT', 'PATCH'], 'directorates/{directorate}', [DirectorateController::class, 'update'])->middleware('permission:directorates.update');
	Route::delete('directorates/{directorate}', [DirectorateController::class, 'destroy'])->middleware('permission:directorates.delete');

	Route::get('departments', [DepartmentController::class, 'index'])->middleware('permission:departments.view');
	Route::post('departments', [DepartmentController::class, 'store'])->middleware('permission:departments.create');
	Route::get('departments/{department}', [DepartmentController::class, 'show'])->middleware('permission:departments.view');
	Route::match(['PUT', 'PATCH'], 'departments/{department}', [DepartmentController::class, 'update'])->middleware('permission:departments.update');
	Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->middleware('permission:departments.delete');

	Route::get('positions', [PositionController::class, 'index'])->middleware('permission:positions.view');
	Route::post('positions', [PositionController::class, 'store'])->middleware('permission:positions.create');
	Route::get('positions/{position}', [PositionController::class, 'show'])->middleware('permission:positions.view');
	Route::match(['PUT', 'PATCH'], 'positions/{position}', [PositionController::class, 'update'])->middleware('permission:positions.update');
	Route::delete('positions/{position}', [PositionController::class, 'destroy'])->middleware('permission:positions.delete');

	Route::get('job-functions', [JobFunctionController::class, 'index'])->middleware('permission:functions.view');
	Route::post('job-functions', [JobFunctionController::class, 'store'])->middleware('permission:functions.create');
	Route::get('job-functions/{jobFunction}', [JobFunctionController::class, 'show'])->middleware('permission:functions.view');
	Route::match(['PUT', 'PATCH'], 'job-functions/{jobFunction}', [JobFunctionController::class, 'update'])->middleware('permission:functions.update');
	Route::delete('job-functions/{jobFunction}', [JobFunctionController::class, 'destroy'])->middleware('permission:functions.delete');

	Route::get('pay-scales', [PayScaleController::class, 'index'])->middleware('permission:pay_scales.view');
	Route::post('pay-scales', [PayScaleController::class, 'store'])->middleware('permission:pay_scales.create');
	Route::get('pay-scales/{payScale}', [PayScaleController::class, 'show'])->middleware('permission:pay_scales.view');
	Route::match(['PUT', 'PATCH'], 'pay-scales/{payScale}', [PayScaleController::class, 'update'])->middleware('permission:pay_scales.update');
	Route::delete('pay-scales/{payScale}', [PayScaleController::class, 'destroy'])->middleware('permission:pay_scales.delete');

	Route::get('documents', [DocumentController::class, 'index'])->middleware('permission:documents.view');
	Route::post('documents', [DocumentController::class, 'store'])->middleware('permission:documents.upload');
	Route::get('documents/{document}/download', [DocumentController::class, 'download'])->middleware('permission:documents.view');
	Route::get('documents/{document}', [DocumentController::class, 'show'])->middleware('permission:documents.view');
	Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->middleware('permission:documents.delete');

	Route::get('employment-records', [EmploymentController::class, 'index'])->middleware('permission:employees.view');
	Route::post('employment-records', [EmploymentController::class, 'store'])->middleware('permission:employees.update');
	Route::patch('employment-records/{employmentRecord}', [EmploymentController::class, 'update'])->middleware('permission:employees.update');
	Route::delete('employment-records/{employmentRecord}', [EmploymentController::class, 'destroy'])->middleware('permission:employees.update');

	Route::get('assets', [AssetController::class, 'index'])->middleware('permission:assets.view');
	Route::post('assets', [AssetController::class, 'store'])->middleware('permission:assets.assign');
	Route::get('assets/{asset}', [AssetController::class, 'show'])->middleware('permission:assets.view');
	Route::match(['PUT', 'PATCH'], 'assets/{asset}', [AssetController::class, 'update'])->middleware('permission:assets.assign');
	Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->middleware('permission:assets.return');
	Route::get('asset-assignments', [AssetAssignmentController::class, 'index'])->middleware('permission:assets.view');
	Route::post('asset-assignments', [AssetAssignmentController::class, 'store'])->middleware('permission:assets.assign');
	Route::patch('asset-assignments/{assetAssignment}/return', [AssetAssignmentController::class, 'returnAsset'])->middleware('permission:assets.return');
	Route::delete('asset-assignments/{assetAssignment}', [AssetAssignmentController::class, 'destroy'])->middleware('permission:assets.return');

	Route::get('reports/summary', [ReportController::class, 'summary'])->middleware('permission:reports.view');
	Route::get('reports/headcount', [ReportController::class, 'headcount'])->middleware('permission:reports.view');
	Route::get('reports/by-department', [ReportController::class, 'byDepartment'])->middleware('permission:reports.view');
	Route::get('reports/by-pay-scale', [ReportController::class, 'byPayScale'])->middleware('permission:reports.view');
	Route::get('reports/staff-by-department', [ReportController::class, 'staffByDepartment'])->middleware('permission:reports.view');
	Route::get('reports/assets', [ReportController::class, 'assets'])->middleware('permission:reports.view');
	Route::get('reports/incomplete-dossiers', [ReportController::class, 'incompleteDossiers'])->middleware('permission:reports.view');
	Route::get('salary-assignments', [SalaryController::class, 'index'])->middleware('permission:salary.view');
	Route::post('salary-assignments', [SalaryController::class, 'store'])->middleware('permission:salary.create');
	Route::patch('salary-assignments/{salaryAssignment}', [SalaryController::class, 'update'])->middleware('permission:salary.update');
	Route::delete('salary-assignments/{salaryAssignment}', [SalaryController::class, 'destroy'])->middleware('permission:salary.delete');

	Route::get('qualifications', [QualificationController::class, 'index'])->middleware('permission:qualifications.view');
	Route::post('qualifications', [QualificationController::class, 'store'])->middleware('permission:qualifications.create');
	Route::patch('qualifications/{qualification}', [QualificationController::class, 'update'])->middleware('permission:qualifications.update');
	Route::delete('qualifications/{qualification}', [QualificationController::class, 'destroy'])->middleware('permission:qualifications.delete');

	Route::get('work-experiences', [WorkExperienceController::class, 'index'])->middleware('permission:work_experiences.view');
	Route::post('work-experiences', [WorkExperienceController::class, 'store'])->middleware('permission:work_experiences.create');
	Route::patch('work-experiences/{workExperience}', [WorkExperienceController::class, 'update'])->middleware('permission:work_experiences.update');
	Route::delete('work-experiences/{workExperience}', [WorkExperienceController::class, 'destroy'])->middleware('permission:work_experiences.delete');
});
