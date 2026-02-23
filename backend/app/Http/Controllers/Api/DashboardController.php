<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats()
    {
        $user = Auth::user();

        // Base queries
        $requisitionQuery = Requisition::query();
        $vehicleQuery = Vehicle::query();
        $driverQuery = Driver::query();
        $userQuery = User::query();

        // Filter by department for department heads
        if ($user->role === 'department_head') {
            $requisitionQuery->where('department', $user->department);
        } elseif ($user->role === 'employee') {
            $requisitionQuery->where('user_id', $user->id);
        }

        $stats = [
            'total_requisitions' => $requisitionQuery->count(),
            'pending_requisitions' => $requisitionQuery->where('status', 'pending')->count(),
            'approved_requisitions' => $requisitionQuery->where('status', 'approved')->count(),
            'rejected_requisitions' => $requisitionQuery->where('status', 'rejected')->count(),
            'completed_requisitions' => $requisitionQuery->where('status', 'completed')->count(),
            'total_vehicles' => $vehicleQuery->count(),
            'available_vehicles' => $vehicleQuery->where('status', 'available')->count(),
            'in_use_vehicles' => $vehicleQuery->where('status', 'in_use')->count(),
            'maintenance_vehicles' => $vehicleQuery->where('status', 'maintenance')->count(),
            'total_drivers' => $driverQuery->count(),
            'available_drivers' => $driverQuery->where('status', 'available')->count(),
            'on_trip_drivers' => $driverQuery->where('status', 'on_trip')->count(),
            'total_employees' => $userQuery->where('role', 'employee')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent requisitions.
     */
    public function recentRequisitions()
    {
        $user = Auth::user();
        
        $query = Requisition::with(['user', 'vehicle', 'driver'])
            ->orderBy('id', 'desc')
            ->limit(10);

        if ($user->role === 'employee') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'department_head') {
            $query->where('department', $user->department);
        }

        $requisitions = $query->get();

        return response()->json($requisitions);
    }
}
