<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
	public function register(Request $request): JsonResponse
	{
		$validated = $request->validate([
			'name' => ['required', 'string', 'max:255'],
			'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
			'password' => ['required', 'string', 'min:8'],
		]);

		$user = User::create($validated);
		$token = $user->createToken('api-token')->plainTextToken;
		$user->load('roles.permissions');

		return response()->json([
			'token' => $token,
			'user' => $user,
		], 201);
	}

	public function login(Request $request): JsonResponse
	{
		$credentials = $request->validate([
			'email' => ['required', 'string', 'email'],
			'password' => ['required', 'string'],
		]);

		$user = User::where('email', $credentials['email'])->first();

		if (! $user || ! Hash::check($credentials['password'], $user->password)) {
			throw ValidationException::withMessages([
				'email' => ['The provided credentials are incorrect.'],
			]);
		}

		$token = $user->createToken('api-token')->plainTextToken;
		$user->load('roles.permissions');

		return response()->json([
			'token' => $token,
			'user' => $user,
		]);
	}

	public function me(Request $request): JsonResponse
	{
		$request->user()?->load('roles.permissions');

		return response()->json([
			'user' => $request->user(),
		]);
	}

	public function logout(Request $request): JsonResponse
	{
		$request->user()?->currentAccessToken()?->delete();

		return response()->json([
			'message' => 'Logged out successfully.',
		]);
	}
}
