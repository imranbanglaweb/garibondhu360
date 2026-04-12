<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    /**
     * List all users (Admin/TransportAdmin only).
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TRANSPORT_ADMIN])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        if ($request->has('department') && $request->department) {
            $query->where('department', $request->department);
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('cell_phone', 'like', "%{$request->search}%");
            });
        }

        $perPage = $request->per_page ?? 20;
        $users = $query->latest()->paginate($perPage);

        return response()->json($users);
    }

    /**
     * Get single user.
     */
    public function show(User $user)
    {
        $authUser = Auth::user();
        
        if (!in_array($authUser->role, [User::ROLE_ADMIN, User::ROLE_TRANSPORT_ADMIN])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($user);
    }

    /**
     * Create new user (Admin only).
     */
    public function store(Request $request)
    {
        $authUser = Auth::user();
        
        if ($authUser->role !== User::ROLE_ADMIN) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|max:255|unique:users',
            'cell_phone' => 'required|regex:/^01[3-9]\d{8}$/u|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,transport_admin,department_head,employee,driver',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Update user (Admin only).
     */
    public function update(Request $request, User $user)
    {
        $authUser = Auth::user();
        
        if ($authUser->role !== User::ROLE_ADMIN) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email:rfc,dns|max:255|unique:users,email,' . $user->id,
            'cell_phone' => 'sometimes|regex:/^01[3-9]\d{8}$/u|unique:users,cell_phone,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:admin,transport_admin,department_head,employee,driver',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Delete user (Admin only).
     */
    public function destroy(User $user)
    {
        $authUser = Auth::user();
        
        if ($authUser->role !== User::ROLE_ADMIN) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($authUser->id === $user->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}