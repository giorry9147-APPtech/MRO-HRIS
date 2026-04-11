<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
	public function run(): void
	{
		$admin = User::firstOrCreate(
			['email' => 'admin@mro-hris.local'],
			[
				'name' => 'System Admin',
				'password' => 'Admin12345',
			]
		);

		$admin->assignRole('admin');
	}
}
