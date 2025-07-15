<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Password\PasswordController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [PasswordController::class, 'forgotPassword']);
Route::post('/reset-password/{token}/{id}', [PasswordController::class, 'resetPassword'])->name('password.reset')->middleware('api');
Route::get('/reset-password/{token}', function ($token) {
    return response()->json([
        'token' => $token,
    ]);
});
