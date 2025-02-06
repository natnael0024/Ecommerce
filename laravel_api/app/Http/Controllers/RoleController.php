<?php
namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $request->validate([
            // 'name' => 'required|string|max:255|unique:roles,name',
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
            // 'permission.*' => 'exists:permissions,id',
        ]);

        try {
            $role = Role::create(['name' => $request->input('name'), 'guard_name' => 'web']);

            $role->syncPermissions($request->input('permissions'));

        } catch (\Exception $e) {
            // throw $e;
            return response()->json(['message' => $e->getMessage()], 400);
        }
        return response()->json(['message' => 'Role created successfully.', 'role' => $role], 201);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|array', 
            // 'permission.*' => 'string|exists:permissions,name',
        ]);

        // Update role name
        $role->name = $request->input('name');
        $role->save();

        // Sync permissions if provided
        if ($request->has('permissions')) {
            $role->syncPermissions($request->input('permissions'));
        }

        return response()->json(['message' => 'Role updated successfully.', 'role' => $role]);
    }

    public function show($id)
    {
        $role = Role::findOrFail($id);
        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        // $role->delete();
        DB::table('roles')->where('id', $id)->delete();

        return response()->json(['message' => 'Role deleted successfully',$role],200);
    }
}
