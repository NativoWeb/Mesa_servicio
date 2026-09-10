<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $shifts = Shift::with('technician')
            ->when($request->technician_id, fn ($q, $id) => $q->where('technician_id', $id))
            ->when($request->date, fn ($q, $date) => $q->whereDate('date', $date))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->campus, fn ($q, $campus) => $q->where('campus', $campus))
            ->orderBy('date')
            ->orderBy('start_time')
            ->paginate($request->per_page ?? 15);

        return response()->json($shifts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'campus' => 'nullable|string|max:100',
            'building' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:scheduled,active,completed',
        ]);

        $shift = Shift::create($validated);

        return response()->json($shift->load('technician'), 201);
    }

    public function show(Shift $shift): JsonResponse
    {
        return response()->json($shift->load('technician'));
    }

    public function update(Request $request, Shift $shift): JsonResponse
    {
        $validated = $request->validate([
            'technician_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'campus' => 'nullable|string|max:100',
            'building' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:scheduled,active,completed',
        ]);

        $shift->update($validated);

        return response()->json($shift->fresh('technician'));
    }

    public function destroy(Shift $shift): JsonResponse
    {
        $shift->delete();

        return response()->json(['message' => 'Turno eliminado correctamente.']);
    }
}
