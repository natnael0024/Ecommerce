<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    /**
     * Register
     */
    public function register(Request $request)
    {
        // $user->assignRole('admin'); // Assign role
        $validated = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|max:100|unique:users,email',
            'password' => 'required',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $request->role == "admin" ? $user->assignRole('admin') : $user->assignRole('user');
        return response()->json([
            'message'=>'User created',
        ],201);
    }

    /**
     * Login.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'=>'required',
            'password'=>'required',
        ]); 
        if(!Auth::attempt($validated))
        {
            return response()->json([
                'message'=>'Invalid Credentials'
            ],400);
        }

        $user = Auth::user();
        
        $roleName = $user->getRoleNames()->first() ?? 'No Role Assigned';
        $response['access_token']= $user->createToken('auth_token')->plainTextToken;
        $response['role']=$roleName;
        $response['user']=$user;
        $user->makeHidden('roles');
        return response()->json($response,200);
    }
}
