<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
	public function run(): void
	{
		$permissions = [
			'employees.view',
			'employees.create',
			'employees.update',
			'employees.delete',
			'functions.view',
			'functions.create',
			'functions.update',
			'functions.delete',
			'departments.view',
			'departments.create',
			'departments.update',
			'departments.delete',
			'directorates.view',
			'directorates.create',
			'directorates.update',
			'directorates.delete',
			'positions.view',
			'positions.create',
			'positions.update',
			'positions.delete',
			'pay_scales.view',
			'pay_scales.create',
			'pay_scales.update',
			'pay_scales.delete',
			'documents.view',
			'documents.upload',
			'documents.delete',
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
			'salary.delete',
			'assets.view',
			'assets.assign',
			'assets.return',
			'reports.view',
			'users.scope.update',
		];

		foreach ($permissions as $permission) {
			Permission::firstOrCreate(['name' => $permission]);
		}
	}
}
