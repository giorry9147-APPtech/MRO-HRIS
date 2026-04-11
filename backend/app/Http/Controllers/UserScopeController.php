<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserScopeRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserScopeController extends Controller
{
	public function index(Request $request): JsonResponse
	{
		$users = User::query()
			->select(['id', 'name', 'email', 'scope_type', 'allowed_directorate_ids', 'allowed_department_ids'])
			->orderBy('name')
			->paginate((int) $request->input('per_page', 50));

		return response()->json($users);
	}

	public function update(UpdateUserScopeRequest $request, User $user): JsonResponse
	{
		$validated = $request->validated();

		$user->update([
			'scope_type' => $validated['scope_type'],
			'allowed_directorate_ids' => $validated['allowed_directorate_ids'] ?? null,
			'allowed_department_ids' => $validated['allowed_department_ids'] ?? null,
		]);

		return response()->json([
			'message' => 'User scope updated.',
			'data' => [
				'user_id' => $user->id,
				'scope_type' => $user->scope_type,
				'allowed_directorate_ids' => $user->allowed_directorate_ids,
				'allowed_department_ids' => $user->allowed_department_ids,
			],
		]);
	}
}
