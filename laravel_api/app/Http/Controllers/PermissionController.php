<?php
namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;


class PermissionController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('permission:permission-list|permission-create|permission-edit|permission-delete', ['only' => ['index', 'store']]);
    //     $this->middleware('permission:permission-create', ['only' => ['create', 'store']]);
    //     $this->middleware('permission:permission-edit', ['only' => ['edit', 'update']]);
    //     $this->middleware('permission:permission-delete', ['only' => ['destroy']]);
    // }

    public function index()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    // Create a new permission
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->input('name'),'guard_name'=>'web']);

        return response()->json(['message' => 'Permission created successfully.', 'permission' => $permission], 201);
    }

    // Show a specific permission
    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json($permission);
    }

    // Update an existing permission
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $permission->name = $request->input('name');
        $permission->save();

        return response()->json(['message' => 'Permission updated successfully.', 'permission' => $permission]);
    }

    // Delete a permission
    public function destroy($id)
    {
        DB::table('permissions')->where('id', $id)->delete();

        return response()->json(['message' => 'Permission deleted successfully']);
    }
}
