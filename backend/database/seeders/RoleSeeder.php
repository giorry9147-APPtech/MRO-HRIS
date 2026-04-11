<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
	public function run(): void
	{
		app(PermissionRegistrar::class)->forgetCachedPermissions();

		$adminRole = Role::firstOrCreate(['name' => 'admin']);
		$hrRole = Role::firstOrCreate(['name' => 'hr_officer']);
		$viewerRole = Role::firstOrCreate(['name' => 'viewer']);

		$allPermissions = Permission::query()->pluck('name')->all();
		$adminRole->syncPermissions($allPermissions);

		$hrRole->syncPermissions([
			'employees.view',
			'employees.create',
			'employees.update',
			'functions.view',
			'functions.create',
			'functions.update',
			'departments.view',
			'directorates.view',
			'positions.view',
			'pay_scales.view',
			'pay_scales.create',
			'pay_scales.update',
			'documents.view',
			'documents.upload',
			'qualifications.view',
			'qualifications.create',
			'qualifications.update',
			'qualifications.delete',
			'work_experiences.view',
			'work_experiences.create',
			'work_experiences.update',
			'work_experiences.delete',
			'salary.view',
			'salary.create',
			'salary.update',
			'assets.view',
			'assets.assign',
			'assets.return',
			'reports.view',
		]);

		$viewerRole->syncPermissions([
			'employees.view',
			'functions.view',
			'departments.view',
			'directorates.view',
			'positions.view',
			'pay_scales.view',
			'documents.view',
			'qualifications.view',
			'work_experiences.view',
			'salary.view',
			'assets.view',
			'reports.view',
		]);
	}
}
