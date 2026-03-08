<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Contact;
use App\Models\DemoRequest;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get public statistics.
     */
    public function stats()
    {
        // Get counts from database
        $totalUsers = User::count();
        $totalVehicles = Vehicle::count();
        $totalDrivers = Driver::count();
        $totalContacts = Contact::count();
        $totalDemoRequests = DemoRequest::count();
        
        // Calculate uptime (mock value - in production this would be from actual monitoring)
        $uptime = 99.9;
        
        return response()->json([
            'success' => true,
            'data' => [
                'totalUsers' => $totalUsers,
                'totalVehicles' => $totalVehicles,
                'totalDrivers' => $totalDrivers,
                'totalContacts' => $totalContacts,
                'totalDemoRequests' => $totalDemoRequests,
                'uptime' => $uptime,
            ],
        ]);
    }
}
