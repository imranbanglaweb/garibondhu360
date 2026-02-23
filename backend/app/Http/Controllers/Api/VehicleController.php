<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * Display a listing of the vehicles.
     */
    public function index(Request $request)
    {
        $query = Vehicle::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('registration_number', 'like', '%' . $request->search . '%')
                  ->orWhere('brand', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%');
        }

        $vehicles = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($vehicles);
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|unique:vehicles',
            'vehicle_type' => 'required|string',
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'color' => 'nullable|string',
            'capacity' => 'required|integer',
            'fuel_type' => 'required|string',
            'purchase_date' => 'nullable|date',
            'insurance_expiry' => 'nullable|date',
            'tax_token_expiry' => 'nullable|date',
            'fitness_expiry' => 'nullable|date',
            'status' => 'required|string|in:available,in_use,maintenance,out_of_service',
        ]);

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicle,
        ], 201);
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle->load(['drivers', 'requisitions']));
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'registration_number' => 'sometimes|string|unique:vehicles,registration_number,' . $vehicle->id,
            'vehicle_type' => 'sometimes|string',
            'brand' => 'sometimes|string',
            'model' => 'sometimes|string',
            'year' => 'sometimes|integer',
            'color' => 'nullable|string',
            'capacity' => 'sometimes|integer',
            'fuel_type' => 'sometimes|string',
            'purchase_date' => 'nullable|date',
            'insurance_expiry' => 'nullable|date',
            'tax_token_expiry' => 'nullable|date',
            'fitness_expiry' => 'nullable|date',
            'status' => 'sometimes|string|in:available,in_use,maintenance,out_of_service',
            'current_mileage' => 'nullable|integer',
            'notes' => 'nullable|string',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Remove the specified vehicle.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully',
        ]);
    }
}
