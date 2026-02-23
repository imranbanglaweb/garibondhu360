<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequisitionController extends Controller
{
    /**
     * Display a listing of the requisitions.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Requisition::with(['user', 'vehicle', 'driver']);

        // Filter by user role
        if ($user->role === 'employee') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'department_head') {
            $query->where('department', $user->department);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $requisitions = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($requisitions);
    }

    /**
     * Store a newly created requisition.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string',
            'purpose' => 'required|string',
            'pickup_location' => 'required|string',
            'destination' => 'required|string',
            'travel_date' => 'required|date',
            'return_date' => 'nullable|date',
            'passengers' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['requisition_number'] = Requisition::generateRequisitionNumber();
        $validated['status'] = Requisition::STATUS_PENDING;

        $requisition = Requisition::create($validated);

        return response()->json([
            'message' => 'Requisition created successfully',
            'requisition' => $requisition->load(['user', 'vehicle', 'driver']),
        ], 201);
    }

    /**
     * Display the specified requisition.
     */
    public function show(Requisition $requisition)
    {
        return response()->json($requisition->load(['user', 'vehicle', 'driver']));
    }

    /**
     * Update the specified requisition.
     */
    public function update(Request $request, Requisition $requisition)
    {
        $validated = $request->validate([
            'department' => 'sometimes|string',
            'purpose' => 'sometimes|string',
            'pickup_location' => 'sometimes|string',
            'destination' => 'sometimes|string',
            'travel_date' => 'sometimes|date',
            'return_date' => 'nullable|date',
            'passengers' => 'sometimes|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $requisition->update($validated);

        return response()->json([
            'message' => 'Requisition updated successfully',
            'requisition' => $requisition->load(['user', 'vehicle', 'driver']),
        ]);
    }

    /**
     * Remove the specified requisition.
     */
    public function destroy(Requisition $requisition)
    {
        if (!in_array($requisition->status, [Requisition::STATUS_PENDING, Requisition::STATUS_REJECTED])) {
            return response()->json([
                'message' => 'Cannot delete requisition in current status',
            ], 422);
        }

        $requisition->delete();

        return response()->json([
            'message' => 'Requisition deleted successfully',
        ]);
    }

    /**
     * Approve requisition.
     */
    public function approve(Request $request, Requisition $requisition)
    {
        $user = Auth::user();

        if ($requisition->status === Requisition::STATUS_PENDING) {
            if ($user->role === 'department_head' || $user->role === 'admin') {
                $requisition->update([
                    'status' => Requisition::STATUS_DEPARTMENT_HEAD_APPROVED,
                    'department_head_approved_by' => $user->id,
                    'department_head_approved_at' => now(),
                ]);
            }
        } elseif ($requisition->status === Requisition::STATUS_DEPARTMENT_HEAD_APPROVED) {
            if ($user->role === 'transport_admin' || $user->role === 'admin') {
                $requisition->update([
                    'status' => Requisition::STATUS_APPROVED,
                    'transport_admin_approved_by' => $user->id,
                    'transport_admin_approved_at' => now(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Requisition approved successfully',
            'requisition' => $requisition->load(['user', 'vehicle', 'driver']),
        ]);
    }

    /**
     * Reject requisition.
     */
    public function reject(Request $request, Requisition $requisition)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $requisition->update([
            'status' => Requisition::STATUS_REJECTED,
            'rejected_by' => Auth::id(),
            'rejected_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Requisition rejected successfully',
            'requisition' => $requisition->load(['user', 'vehicle', 'driver']),
        ]);
    }
}
