package com.keystones.keystones.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.keystones.keystones.backend.DTO.SLAResponseDTO;
import com.keystones.keystones.backend.Service.SLAService;

@RestController
@RequestMapping("/api/sla")
public class SLAController {

    private final SLAService slaService;

    public SLAController(SLAService slaService) {
        this.slaService = slaService;
    }

    // Create SLA
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('UPDATE_WORK_STATUS')")
    public ResponseEntity<SLAResponseDTO> createSLA(
            @RequestParam Long workOrderId,
            @RequestParam long responseHours,
            @RequestParam long resolutionHours) {

        return ResponseEntity.ok(
                slaService.createSLA(
                        workOrderId,
                        responseHours,
                        resolutionHours));
    }

    // Get SLA by Work Order
    @GetMapping("/work-order/{workOrderId}")
    @PreAuthorize("hasAuthority('VIEW_WORK_ORDER')")
    public ResponseEntity<SLAResponseDTO> getSLA(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                slaService.getSLAByWorkOrder(workOrderId));
    }

    // Mark Work Order as Responded
    @PostMapping("/work-order/{workOrderId}/respond")
    @PreAuthorize("hasAuthority('UPDATE_WORK_STATUS')")
    public ResponseEntity<SLAResponseDTO> markResponded(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                slaService.markResponded(workOrderId));
    }

    // Mark Work Order as Resolved
    @PostMapping("/work-order/{workOrderId}/resolve")
    @PreAuthorize("hasAuthority('UPDATE_WORK_STATUS')")
    public ResponseEntity<SLAResponseDTO> markResolved(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                slaService.markResolved(workOrderId));
    }
}