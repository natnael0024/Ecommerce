<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('name','asc')
            ->paginate(10);
        return UserResource::collection($users)->response()->getData(true);
    }

    public function getCustomers(): mixed
    {
        $customers = User::role('user')->orderBy('created_at','desc')
            ->paginate(10);
        return UserResource::collection($customers)->response()->getData(true);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:100',
            'email'=> 'required',
            'password' => 'required'
        ]);

        $user = User::create($validated);
        $request->role == "admin" ? $user->assignRole('admin') : $user->assignRole('user');

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        if(Auth::id() != $user->id && !Auth::user()->hasRole('admin'))
            return response()->json(
            ['message'=>'you don\'t have permission'],
            403);
        
        $validated = $request->validate([
            'name' => 'sometimes|max:100',
            'email'=> 'sometimes',
            'password' => 'sometimes'
        ]);

        if($request->role && Auth::user()->hasRole('admin')){
            $user->syncRoles([$request->role]);
        }

        $user->update($validated);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        if(Auth::id() != $user->id && !Auth::user()->hasRole('admin'))
            return response()->json(
            ['message'=>'you don\'t have permission'],
            403);
        $user->delete();

        return response()->json([],204);
    }
}
