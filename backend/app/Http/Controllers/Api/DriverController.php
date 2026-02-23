<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    /**
     * Display a listing of the drivers.
     */
    public function index(Request $request)
    {
        $query = Driver::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%')
                  ->orWhere('license_number', 'like', '%' . $request->search . '%');
        }

        $drivers = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($drivers);
    }

    /**
     * Store a newly created driver.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:drivers',
            'email' => 'nullable|email|unique:drivers',
            'license_number' => 'required|string|unique:drivers',
            'license_expiry' => 'required|date',
            'nid_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'join_date' => 'nullable|date',
            'status' => 'required|string|in:available,on_trip,off_duty',
        ]);

        $driver = Driver::create($validated);

        return response()->json([
            'message' => 'Driver created successfully',
            'driver' => $driver,
        ], 201);
    }

    /**
     * Display the specified driver.
     */
    public function show(Driver $driver)
    {
        return response()->json($driver->load(['vehicles', 'requisitions']));
    }

    /**
     * Update the specified driver.
     */
    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|unique:drivers,phone,' . $driver->id,
            'email' => 'nullable|email|unique:drivers,email,' . $driver->id,
            'license_number' => 'sometimes|string|unique:drivers,license_number,' . $driver->id,
            'license_expiry' => 'sometimes|date',
            'nid_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'join_date' => 'nullable|date',
            'status' => 'sometimes|string|in:available,on_trip,off_duty',
            'rating' => 'nullable|numeric|min:0|max:5',
            'notes' => 'nullable|string',
        ]);

        $driver->update($validated);

        return response()->json([
            'message' => 'Driver updated successfully',
            'driver' => $driver,
        ]);
    }

    /**
     * Remove the specified driver.
     */
    public function destroy(Driver $driver)
    {
        $driver->delete();

        return response()->json([
            'message' => 'Driver deleted successfully',
        ]);
    }
}
