package com.keystones.keystones.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.keystones.keystones.backend.DTO.TimeEntryResponseDTO;
import com.keystones.keystones.backend.Entity.TimeEntry;
import com.keystones.keystones.backend.Service.TimeTrackingService;

@RestController
@RequestMapping("/api/time-tracking")
public class TimeTrackingController {

    private final TimeTrackingService timeTrackingService;

    public TimeTrackingController(
            TimeTrackingService timeTrackingService) {

        this.timeTrackingService = timeTrackingService;
    }

    // Start Work
    @PostMapping("/start")
    @PreAuthorize("hasAuthority('TRACK_TIME')")
    public ResponseEntity<TimeEntry> startWork(
            @RequestParam Long workOrderId,
            @RequestParam Long technicianId) {

        return ResponseEntity.ok(
                timeTrackingService.startWork(
                        workOrderId,
                        technicianId));
    }

    // Stop Work
    @PostMapping("/stop")
    @PreAuthorize("hasAuthority('TRACK_TIME')")
    public ResponseEntity<TimeEntry> stopWork(
            @RequestParam Long workOrderId,
            @RequestParam Long technicianId) {

        return ResponseEntity.ok(
                timeTrackingService.stopWork(
                        workOrderId,
                        technicianId));
    }

    // Get time entries by Work Order
    @GetMapping("/work-order/{workOrderId}")
    @PreAuthorize("hasAuthority('TRACK_TIME')")
    public ResponseEntity<List<TimeEntryResponseDTO>> getByWorkOrder(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                timeTrackingService
                        .getTimeEntriesByWorkOrder(workOrderId));
    }

    // Get time entries by Technician
    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAuthority('TRACK_TIME')")
    public ResponseEntity<List<TimeEntryResponseDTO>> getByTechnician(
            @PathVariable Long technicianId) {

        return ResponseEntity.ok(
                timeTrackingService
                        .getTimeEntriesByTechnician(technicianId));
    }
}