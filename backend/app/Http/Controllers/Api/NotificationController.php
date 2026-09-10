<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->roles->first()?->name;

        $query = Activity::with('causer')
            ->orderByDesc('created_at');

        if ($role === 'end_user') {
            $ticketIds = Ticket::where('requester_id', $user->id)->pluck('id');
            $query->where('subject_type', 'App\\Models\\Ticket')
                  ->whereIn('subject_id', $ticketIds);
        } elseif ($role === 'asset_holder') {
            $assetIds = Asset::where('holder_id', $user->id)->pluck('id');
            $query->where(function ($q) use ($assetIds) {
                $q->where(function ($q2) use ($assetIds) {
                    $q2->where('subject_type', 'App\\Models\\Asset')
                       ->whereIn('subject_id', $assetIds);
                });
            });
        } elseif ($role === 'technician') {
            $ticketIds = Ticket::where('assigned_to', $user->id)->pluck('id');
            $query->where('subject_type', 'App\\Models\\Ticket')
                  ->whereIn('subject_id', $ticketIds);
        }
        // admin/it_leader see all activities

        return response()->json($query->paginate($request->integer('per_page', 20)));
    }
}
